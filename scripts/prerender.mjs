// Prerender build step.
//
// Why this exists: the site's content (nav labels, hero copy, case studies,
// experience entries) is only ever rendered client-side, by JS reading
// messages.en.properties and the JSON data files and writing text into empty
// container elements. Anything that doesn't run JS -- link-preview bots,
// some crawlers, `curl`, a slow connection -- sees empty containers and
// literal `{nav.about}`-style placeholder text.
//
// This script drives the site's *real* compiled JS (via jsdom) once per
// route at build time, waits for it to finish populating the DOM, and saves
// the resulting HTML as a real static file. The shipped output still loads
// the real ES module scripts too, so JS-capable browsers get the exact same
// interactive site as before -- this only changes what's there before JS runs.
//
// jsdom does not execute `<script type="module">` at all (silently -- no
// error), so for the purposes of *this script only* we bundle the compiled
// output into classic IIFE scripts with esbuild and swap them in when
// serving to jsdom. The final saved HTML is rewritten back to reference the
// real ES module files, so nothing about the shipped site changes.

import * as esbuild from "esbuild";
import { JSDOM } from "jsdom";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, rm, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "dist-static");
const PORT = 4780;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".properties": "text/plain",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".pdf": "application/pdf",
};

// The two compiled entry scripts every page loads as `<script type="module">`.
// We bundle each into a classic-script IIFE so jsdom can actually run it.
const ENTRY_SCRIPTS = [
    { real: "dist/static/js/edsite-scripts.js" },
    { real: "dist/static/js/case-study.js" },
];

// Every route to prerender: the on-disk template it's based on, the URL
// path jsdom should load it as (this drives pageId() / caseStudyIdFromUrl()
// via real path routing), and how many entry scripts run `init()` on that
// page (used to know when rendering is actually finished).
async function buildRoutes() {
    const caseStudies = JSON.parse(
        await readFile(join(ROOT, "src/data/case-studies.json"), "utf-8")
    );

    return [
        { template: "index.html", outPath: "index.html", scriptCount: 1 },
        { template: "pages.html", outPath: "about.html", scriptCount: 1 },
        { template: "pages.html", outPath: "projects.html", scriptCount: 1 },
        { template: "pages.html", outPath: "experience.html", scriptCount: 1 },
        { template: "pages.html", outPath: "contact.html", scriptCount: 1 },
        ...caseStudies.map((cs) => ({
            template: "case-study.html",
            outPath: `case-study-${cs.id}.html`,
            scriptCount: 2, // edsite-scripts.js AND case-study.js both run init()
        })),
    ];
}

async function bundleEntryScripts() {
    const bundles = new Map(); // real path -> bundled JS source
    for (const { real } of ENTRY_SCRIPTS) {
        const result = await esbuild.build({
            entryPoints: [join(ROOT, real)],
            bundle: true,
            format: "iife",
            platform: "browser",
            write: false,
        });
        bundles.set(real, result.outputFiles[0].text);
    }
    return bundles;
}

function startServer(bundles, routes) {
    // Prerendered output paths (about.html, projects.html, case-study-*.html)
    // don't exist as real files -- they're all served from a shared
    // template (pages.html / case-study.html). Map each output path to the
    // real template file to read from disk.
    const outPathToTemplate = new Map(routes.map((r) => [r.outPath, r.template]));

    return new Promise((resolve) => {
        const server = createServer(async (req, res) => {
            const url = new URL(req.url, `http://localhost:${PORT}`);
            const pathname = decodeURIComponent(url.pathname);
            const relPath = pathname.replace(/^\//, "");

            // Serve bundled classic-script versions of the two entry
            // scripts, at their normal URL, so jsdom can execute them.
            if (bundles.has(relPath)) {
                res.writeHead(200, { "Content-Type": "text/javascript" });
                res.end(bundles.get(relPath));
                return;
            }

            const onDiskRelPath = outPathToTemplate.get(relPath) ?? relPath;
            const filePath = join(ROOT, onDiskRelPath === "" ? "index.html" : onDiskRelPath);
            try {
                const data = await readFile(filePath);
                let body = data;

                // For HTML, strip type="module" so the (now classic, bundled)
                // entry scripts actually execute in jsdom.
                if (extname(filePath) === ".html") {
                    body = data
                        .toString("utf-8")
                        .replace(
                            /<script src="(dist\/static\/js\/(?:edsite-scripts|case-study)\.js)" type="module">/g,
                            '<script src="$1">'
                        );
                }

                res.writeHead(200, {
                    "Content-Type": MIME_TYPES[extname(filePath)] || "application/octet-stream",
                });
                res.end(body);
            } catch {
                res.writeHead(404);
                res.end("Not found");
            }
        });

        server.listen(PORT, () => resolve(server));
    });
}

async function waitForReady(window, expectedCount, timeoutMs = 8000) {
    const start = Date.now();
    while ((window.__PRERENDER_READY_COUNT__ ?? 0) < expectedCount) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(
                `Timed out waiting for rendering (got ${window.__PRERENDER_READY_COUNT__ ?? 0}/${expectedCount} scripts ready)`
            );
        }
        await new Promise((r) => setTimeout(r, 25));
    }
}

// Restore the original ES module script tags in the final saved HTML,
// regardless of any runtime mutation (e.g. cache-buster query params)
// jsdom execution may have applied to their src attributes.
function restoreModuleScriptTags(html) {
    return html
        .replace(
            /<script[^>]*src="[^"]*dist\/static\/js\/edsite-scripts\.js[^"]*"[^>]*>\s*<\/script>/,
            '<script src="dist/static/js/edsite-scripts.js" type="module"></script>'
        )
        .replace(
            /<script[^>]*src="[^"]*dist\/static\/js\/case-study\.js[^"]*"[^>]*>\s*<\/script>/,
            '<script src="dist/static/js/case-study.js" type="module"></script>'
        );
}

async function renderRoute(route) {
    const url = `http://localhost:${PORT}/${route.outPath}`;

    // Deliberately not using JSDOM.fromURL: it starts executing <script>
    // tags as soon as the document loads, before we'd get a chance to
    // polyfill window.fetch (jsdom doesn't provide one). Constructing
    // directly from an HTML string gives us that window: script *elements*
    // exist once the constructor returns, but their (async, network-fetched)
    // src content hasn't executed yet.
    const htmlResponse = await fetch(url);
    if (!htmlResponse.ok) {
        throw new Error(`Failed to fetch template for ${route.outPath}: ${htmlResponse.status}`);
    }
    const html = await htmlResponse.text();

    const dom = new JSDOM(html, {
        url,
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true,
    });

    dom.window.fetch = (input, init) => fetch(new URL(input, url).href, init);

    try {
        await waitForReady(dom.window, route.scriptCount);
    } catch (err) {
        dom.window.close();
        throw new Error(`${route.outPath}: ${err.message}`);
    }

    // loadParallax() sets a --scroll custom property on <html> at runtime,
    // used to drive a parallax effect as the user scrolls. It's always 0
    // during prerendering (jsdom never actually scrolls), so it's dynamic
    // runtime state, not real content -- strip it before saving.
    const htmlEl = dom.window.document.documentElement;
    htmlEl.style.removeProperty("--scroll");
    if (htmlEl.getAttribute("style") === "") {
        htmlEl.removeAttribute("style");
    }

    const renderedHtml = restoreModuleScriptTags(dom.serialize());
    dom.window.close();
    return renderedHtml;
}

async function main() {
    console.log("Bundling entry scripts for prerendering...");
    const bundles = await bundleEntryScripts();

    const routes = await buildRoutes();

    console.log("Starting local static server...");
    const server = await startServer(bundles, routes);

    if (existsSync(OUT_DIR)) {
        await rm(OUT_DIR, { recursive: true });
    }
    await mkdir(OUT_DIR, { recursive: true });

    try {
        for (const route of routes) {
            process.stdout.write(`Rendering ${route.outPath} ... `);
            const html = await renderRoute(route);
            await writeFile(join(OUT_DIR, route.outPath), html, "utf-8");
            console.log("done");
        }
    } finally {
        server.close();
    }

    console.log(`\nWrote ${routes.length} static pages to ${OUT_DIR}/`);

    console.log("Copying prerendered pages to project root...");
    for (const route of routes) {
        await copyFile(join(OUT_DIR, route.outPath), join(ROOT, route.outPath));
    }
    console.log(
        `Copied ${routes.length} files to the project root (index.html, about.html, ` +
        "projects.html, etc.) so local servers and hosts serving from root find them directly."
    );
}

main().catch((err) => {
    console.error("\nPrerender failed:", err.message);
    process.exitCode = 1;
});
