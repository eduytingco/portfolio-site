# Ed Uytingco — Portfolio Site

Source for [ed.uytingco.com](https://ed.uytingco.com), my personal portfolio site. Hand-built with TypeScript and SASS — no framework, no CMS, no build tool beyond the TypeScript compiler and a small custom static-site generator.

## Stack

- **TypeScript** (compiled with `tsc`, no bundler) for all client-side behavior
- **SASS/SCSS** for styling, using shared mixins for a consistent glass-panel design system across cards, panels, and the case study layout
- **Plain HTML templates**, populated at runtime by TypeScript reading from JSON data files and a `.properties` file for text content
- **A custom prerendering build step** that runs the site's real client-side code in a headless DOM (via `jsdom`) at build time, so every page ships as real, crawlable static HTML — not just an empty shell that depends on JavaScript to show any content

## How content is structured

- `src/data/case-studies.json` and `src/data/experience-data.json` — case studies and work history are data, not hardcoded HTML. Adding a new case study means adding a JSON entry, not writing markup.
- `src/static/language/messages.en.properties` — all UI text lives here, loaded and applied at runtime. Built with future localization in mind, though only English is implemented today.
- `src/static/css/edsite-styles.scss` — the design system is authored as reusable mixins (e.g. a `glass-surface` mixin for the frosted-glass panel treatment) rather than one-off styles repeated per component.

## Build

```bash
npm install
npm run build
```

This does two things:

1. Compiles TypeScript (`tsc`)
2. Runs a prerender step (`scripts/prerender.mjs`) that loads each page's real compiled JavaScript in a headless DOM, lets it fully render (populating nav text, case study cards, experience entries, etc. from the data files above), and saves the result as static HTML — then copies those files to the project root, ready to deploy as-is

The result: every page works correctly with JavaScript disabled, loads instantly with no client-side data-fetch flash, and is fully readable by search engines and link-preview bots — while still being a fully interactive site for anyone with JavaScript enabled.

## Project structure

```
├── index.html, pages.html, case-study.html   # page shells / build templates
├── src/
│   ├── data/                                  # case studies + experience, as JSON
│   ├── static/
│   │   ├── css/                                # SCSS source + compiled CSS
│   │   ├── js/                                 # TypeScript source
│   │   ├── language/                            # i18n text
│   │   └── images/
├── scripts/prerender.mjs                       # static-site generation build step
└── dist/                                       # compiled JS (generated, not committed)
```