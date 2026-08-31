import { loadMessages, getMessage, appendCacheBusterToExistingScripts } from "./i18n.js";
import { loadCaseStudyData, type CaseStudy } from "./case-study-data.js";
import { loadExperienceData, type Experience } from "./experience-data.js";
import { loadContactForm } from "./contact-form.js";


function renderCaseStudyCard(caseStudy: CaseStudy): HTMLElement {
    const card = document.createElement("a");
    card.className = "case-study-card";
    card.href = `/case-study-${caseStudy.id}.html`;

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "case-study-card-image-wrapper";
    card.append(imgWrapper);

    const img = document.createElement("img");
    img.className = "case-study-card-image";
    img.src = caseStudy.image;
    img.alt = caseStudy.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "case-study-card-body";

    const title = document.createElement("h3");
    title.className = "case-study-card-title";
    title.textContent = caseStudy.title;

    const summary = document.createElement("p");
    summary.className = "case-study-card-summary";
    summary.textContent = caseStudy.problem;

    const tagList = document.createElement("div");
    tagList.className = "case-study-card-tags";
    caseStudy.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "case-study-card-tag";
        tagEl.textContent = getMessage(`tag.${tag}`);
        tagList.appendChild(tagEl);
    });

    body.append(title, summary, tagList);
    card.append(imgWrapper, body);
    imgWrapper.append(img);

    return card;
}

function renderExperienceStack(stack: string[]): HTMLElement {
    const list = document.createElement("ul");
    list.className = "experience-stack-list";

    list.append(
        ...stack.map((item) => {
            const tag = document.createElement("li");
            tag.className = "experience-stack-tag";
            tag.textContent = item;
            return tag;
        })
    );

    return list;
}

function renderExperienceBullets(experience: Experience): HTMLElement {
    const list = document.createElement("ul");
    list.className = "experience-bullet-list";

    list.append(
        ...experience.bullets.map((bullet) => {
            const item = document.createElement("li");
            item.className = "experience-bullet";
            item.textContent = bullet;
            return item;
        })
    );

    return list;
}

function renderExperienceEntry(experience: Experience): HTMLElement {
    const entry = document.createElement("article");
    entry.className = "experience-entry";

    const header = document.createElement("div");
    header.className = "experience-header";

    const company = document.createElement("div");
    company.className = "experience-company";
    company.textContent = experience.company;

    const title = document.createElement("div");
    title.className = "experience-role";
    title.textContent = experience.title;

    const dates = document.createElement("div");
    dates.className = "experience-dates";
    dates.textContent = experience.dates;

    header.append(company, title, dates);

    const summary = document.createElement("p");
    summary.className = "experience-summary";
    summary.textContent = experience.summary;

    entry.append(
        header,
        summary,
        renderExperienceBullets(experience),
        renderExperienceStack(experience.stack)
    );

    return entry;
}

const ABOUT_BUILD_NOTE_SNIPPET = `@mixin glass-surface($radius: 20px) {
    background: rgb(255 255 255 / 55%);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgb(255 255 255 / 40%);
    border-radius: $radius;
    box-shadow:
        0 8px 32px rgb(0 0 0 / 12%),
        inset 0 1px 0 rgb(255 255 255 / 60%);
}`;

function renderAboutBuildNote(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "build-note";

    const intro = document.createElement("p");
    intro.className = "build-note-intro";
    intro.textContent = getMessage("about.buildNote.intro");

    const pre = document.createElement("pre");
    pre.className = "build-note-code";
    const code = document.createElement("code");
    code.textContent = ABOUT_BUILD_NOTE_SNIPPET;
    pre.append(code);

    const caption = document.createElement("p");
    caption.className = "build-note-caption";
    caption.textContent = getMessage("about.buildNote.caption");

    wrapper.append(intro, pre, caption);
    return wrapper;
}

function renderAboutPortrait(): HTMLElement {
    const img = document.createElement("img");
    img.id = "about-portrait";
    img.src = "/src/static/images/v2/edsite-portrait-about.png";
    img.alt = "Portrait of Ed Uytingco";
    img.width = 240;
    img.loading = "lazy";
    return img;
}

function loadAboutPortrait(): void {
    if (pageId() !== "about") {
        return;
    }

    const description = document.getElementById("subpage-content-description");
    if (description === null || description.parentElement === null) {
        return;
    }

    if (document.getElementById("about-portrait") !== null) {
        return;
    }

    description.parentElement.insertBefore(renderAboutPortrait(), description);
}

function loadAboutBuildNote(): void {
    if (pageId() !== "about") {
        return;
    }

    const container = document.getElementById("subpage-insta-content");
    if (container === null) {
        return;
    }

    container.replaceChildren(renderAboutBuildNote());
}

function loadResumeButton(): void {

    const resumeLink = document.getElementById("resume-download");
    if (resumeLink === null) {
        return;
    }

    resumeLink.textContent = getMessage("experience.resumeDownload");
}

function loadSocialLinks(): void {
    const footerLinkedin = document.getElementById("footer-linkedin");
    if (footerLinkedin !== null) {
        footerLinkedin.setAttribute("aria-label", getMessage("footer.linkedin"));
    }
}

async function loadCaseStudies(): Promise<void> {
    if (pageId() !== "projects") {
        return;
    }

    const grid = document.getElementById("subpage-insta-content");
    if (grid === null) {
        return;
    }

    try {
        const caseStudies = await loadCaseStudyData();
        grid.replaceChildren(...caseStudies.map(renderCaseStudyCard));
    } catch (error: unknown) {
        console.error("Unable to load case studies:", error);
    }
}

async function loadExperience(): Promise<void> {
    if (pageId() !== "experience") {
        return;
    }

    const container = document.getElementById("subpage-insta-content");
    if (container === null) {
        return;
    }

    try {
        const entries = await loadExperienceData();
        container.replaceChildren(...entries.map(renderExperienceEntry));
    } catch (error: unknown) {
        console.error("Unable to load experience:", error);
    }
}

function loadNavbar(): void {
    const nav = document.getElementById("subpage-nav");
    const toggle = document.querySelector<HTMLButtonElement>("#nav-menu-toggle");
    const menu = document.getElementById("nav-menu");

    if (nav === null || toggle === null || menu === null) {
        return;
    }

    const navElement = nav;
    const toggleButton = toggle;
    const navMenu = menu;

    function closeMenu(): void {
        toggleButton.classList.remove("is-open");
        navMenu.classList.remove("is-open");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-label", "Open navigation menu");
    }

    toggleButton.addEventListener("click", () => {
        const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
        toggleButton.classList.toggle("is-open", !isOpen);
        navMenu.classList.toggle("is-open", !isOpen);
        toggleButton.setAttribute("aria-expanded", String(!isOpen));
        toggleButton.setAttribute(
            "aria-label",
            isOpen ? "Open navigation menu" : "Close navigation menu"
        );
    });

    navElement.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event: MouseEvent) => {
        const target = event.target instanceof Node ? event.target : null;
        if (
            target !== null &&
            !navElement.contains(target) &&
            !toggleButton.contains(target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeMenu();
            toggleButton.focus();
        }
    });
}

function loadParallax(): void {
    const root = document.documentElement;
    let ticking = false;

    function update(): void {
        root.style.setProperty("--scroll", window.scrollY.toString());
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });

    update();
}

function matchedPageFromPath(): string | null {
    const pathMatch = window.location.pathname.match(/\/([a-z-]+)\.html$/);
    if (
        pathMatch !== null &&
        pathMatch[1] !== "index" &&
        pathMatch[1] !== "pages" &&
        !pathMatch[1].startsWith("case-study")
    ) {
        return pathMatch[1];
    }
    return null;
}

function pageId(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const queryPage = urlParams.get("page");
    if (queryPage !== null) {
        return queryPage;
    }

    return matchedPageFromPath() ?? "case-study";
}

function setText(id: string, key: string): void {
    const element = document.getElementById(id);
    if (element !== null) {
        element.textContent = getMessage(key);
    }
}

const DEFAULT_DOCUMENT_TITLE = "Ed Uytingco's Online Portfolio";

function setDocumentTitle(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const hasPageParam = urlParams.get("page") !== null;
    const hasPathRoute = matchedPageFromPath() !== null;

    if (!hasPageParam && !hasPathRoute) {
        document.title = DEFAULT_DOCUMENT_TITLE;
        return;
    }

    const rawTitle = getMessage(`page.${pageId()}.title`);
    // Strip any markup in case this key contains HTML (it's used with
    // innerHTML elsewhere for the on-page hero title).
    const plainTitle = rawTitle.replace(/<[^>]*>/g, "").trim();
    const brandName = getMessage("brand.name");

    document.title = plainTitle
        ? `${plainTitle} | ${brandName}`
        : brandName;
}

function loadContent(): void {
    [
        ["hero-tagline", "hero.tagline"],
        ["hero-title", "hero.title"],
        ["hero-description", "hero.description"],
        ["hero-button", "hero.button"],
        ["about-title", "about.title"],
        ["about-description", "about.description"],
        ["about-button", "CTA.about"],
        ["projects-title", "projects.title"],
        ["projects-description", "projects.description"],
        ["projects-button", "CTA.projects"],
        ["experience-title", "experience.title"],
        ["experience-description", "experience.description"],
        ["experience-button", "CTA.experience"],
        ["contact-title", "contact.title"],
        ["contact-description", "contact.description"],
        ["contact-button", "CTA.contact"],
        ["footer-text", "footer.text"],
        ["nav-about", "nav.about"],
        ["nav-projects", "nav.projects"],
        ["nav-experience", "nav.experience"],
        ["nav-contact", "nav.contact"],
        ["brand-name", "brand.name"],

    ].forEach(([id, key]) => setText(id, key));
    const brandNameElement = document.getElementById("brand-name");
    if (brandNameElement !== null) {
        brandNameElement.textContent = getMessage("brand.name");
    }
    
    const pageidelement = document.querySelector("[page-id]");
    if (pageidelement) {
        pageidelement.setAttribute("page-id", pageId());
    }

    const pageTitle = document.getElementById("page-title");
    const subpageHeroTitle = document.getElementById("subpage-hero-title");
    if (pageTitle !== null) {
        pageTitle.textContent = getMessage(`page.${pageId()}.title`);
    }
    if (subpageHeroTitle !== null) {
        subpageHeroTitle.innerHTML = getMessage(`page.${pageId()}.title`);
    }

    const subpageContentTitle = document.getElementById("subpage-content-title");
    const subpageContentDescription = document.getElementById("subpage-content-description");
    if (subpageContentTitle !== null) {
        subpageContentTitle.textContent = getMessage(`page.${pageId()}.title`);
    }
    if (subpageContentDescription !== null) {
        subpageContentDescription.textContent = getMessage(`page.${pageId()}.description`);
    }

    const subpageHeroButton = document.getElementById("subpage-hero-button");
    const subpageContentButton = document.getElementById("subpage-content-button");
    if (subpageHeroButton !== null) {
        subpageHeroButton.textContent = getMessage(`CTA.${pageId()}`);
    }
    if (subpageContentButton !== null) {
        subpageContentButton.textContent = getMessage(`CTA.${pageId()}`);
    }

    const subpageNav = document.getElementById("subpage-nav");
    if (subpageNav !== null) {
        subpageNav.setAttribute("aria-label", getMessage(`nav.${pageId()}`));
    }

    const navMenu = document.getElementById("nav-menu");
    if (navMenu !== null) {
        navMenu.setAttribute("aria-label", getMessage(`nav.${pageId()}`));
    }

    const subpageFooter = document.getElementById("subpage-footer");
    if (subpageFooter !== null) {
        subpageFooter.setAttribute("aria-label", getMessage(`footer.${pageId()}`));
    }

    const subpageFooterContent = document.getElementById("subpage-footer-content");
    if (subpageFooterContent !== null) {
        subpageFooterContent.textContent = getMessage(`footer.${pageId()}`);
    }

    setDocumentTitle();
}

// Single source of truth for every internal navigation URL on the site.
// Change a path here and it's picked up everywhere: the main nav, the
// resume link, the index.html quick-link cards, the case-study "back"
// link, and the brand/home logo -- all driven from this one object via
// loadNavigation() and loadRouteLinks() below.
const NAV_ROUTES = {
    home: "index.html",
    about: "about.html",
    projects: "projects.html",
    experience: "experience.html",
    contact: "contact.html",
    resume: "/src/static/documents/ed-uytingco-resume.pdf",
} as const;

function loadNavigation(): void {
    const navLinks = document.querySelectorAll("[nav-link-id]");
    navLinks.forEach((link) => {
        const navLinkId = link.getAttribute("nav-link-id");
        if (navLinkId === null) {
            return;
        }
        link.textContent = getMessage(`nav.${navLinkId}`);
        if (navLinkId in NAV_ROUTES) {
            link.setAttribute("href", NAV_ROUTES[navLinkId as keyof typeof NAV_ROUTES]);
        }
    });
}

// For links that need a URL from NAV_ROUTES but keep their own text
// (CTA buttons, the case-study back-link, the brand/home logo) rather
// than the nav-label text loadNavigation() sets.
function loadRouteLinks(): void {
    document.querySelectorAll("[route-link-id]").forEach((link) => {
        const routeId = link.getAttribute("route-link-id");
        if (routeId !== null && routeId in NAV_ROUTES) {
            link.setAttribute("href", NAV_ROUTES[routeId as keyof typeof NAV_ROUTES]);
        }
    });
}

function loadFooter(): void {
    const footerContent = document.querySelector("[role=footer-content]") || document.getElementById("footer-content");

    if (footerContent === null) {
        return;
    }

    footerContent.textContent = getMessage("footer.text")
        .replace("{0}", String(new Date().getFullYear()));
}

async function init(): Promise<void> {
    try {
        await loadMessages();
        await loadCaseStudies();
        await loadExperience();
        loadAboutBuildNote();
        loadAboutPortrait();
        loadNavbar();
        loadNavigation();
        loadRouteLinks();
        loadParallax();
        loadContent();
        loadResumeButton();
        loadSocialLinks();
        loadContactForm();
        loadFooter();
        appendCacheBusterToExistingScripts();
    } catch (error: unknown) {
        console.error("Unable to initialize the website:", error);
    } finally {
        const w = window as unknown as { __PRERENDER_READY_COUNT__?: number };
        w.__PRERENDER_READY_COUNT__ = (w.__PRERENDER_READY_COUNT__ ?? 0) + 1;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});