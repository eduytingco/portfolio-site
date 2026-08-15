import { loadMessages, getMessage, appendCacheBusterToExistingScripts } from "./i18n.js";
import { loadCaseStudyData } from "./case-study-data.js";
import { loadExperienceData } from "./experience-data.js";
import { loadContactForm } from "./contact-form.js";
function renderCaseStudyCard(caseStudy) {
    const card = document.createElement("a");
    card.className = "case-study-card";
    card.href = `/case-study.html?id=${caseStudy.id}`;
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
    card.append(img, body);
    return card;
}
function renderExperienceStack(stack) {
    const list = document.createElement("ul");
    list.className = "experience-stack-list";
    list.append(...stack.map((item) => {
        const tag = document.createElement("li");
        tag.className = "experience-stack-tag";
        tag.textContent = item;
        return tag;
    }));
    return list;
}
function renderExperienceBullets(experience) {
    const list = document.createElement("ul");
    list.className = "experience-bullet-list";
    list.append(...experience.bullets.map((bullet) => {
        const item = document.createElement("li");
        item.className = "experience-bullet";
        item.textContent = bullet;
        return item;
    }));
    return list;
}
function renderExperienceEntry(experience) {
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
    entry.append(header, summary, renderExperienceBullets(experience), renderExperienceStack(experience.stack));
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
function renderAboutBuildNote() {
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
function loadAboutBuildNote() {
    if (pageId() !== "about") {
        return;
    }
    const container = document.getElementById("subpage-insta-content");
    if (container === null) {
        return;
    }
    container.replaceChildren(renderAboutBuildNote());
}
function loadResumeButton() {
    const resumeLink = document.getElementById("resume-download");
    if (resumeLink === null) {
        return;
    }
    resumeLink.textContent = getMessage("experience.resumeDownload");
}
async function loadCaseStudies() {
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
    }
    catch (error) {
        console.error("Unable to load case studies:", error);
    }
}
async function loadExperience() {
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
    }
    catch (error) {
        console.error("Unable to load experience:", error);
    }
}
function loadNavbar() {
    const nav = document.getElementById("subpage-nav");
    const toggle = document.querySelector("#nav-menu-toggle");
    const menu = document.getElementById("nav-menu");
    if (nav === null || toggle === null || menu === null) {
        return;
    }
    const navElement = nav;
    const toggleButton = toggle;
    const navMenu = menu;
    function closeMenu() {
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
        toggleButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    });
    navElement.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
    document.addEventListener("click", (event) => {
        const target = event.target instanceof Node ? event.target : null;
        if (target !== null &&
            !navElement.contains(target) &&
            !toggleButton.contains(target)) {
            closeMenu();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            toggleButton.focus();
        }
    });
}
function loadParallax() {
    const root = document.documentElement;
    let ticking = false;
    function update() {
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
function pageId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "case-study";
}
function setText(id, key) {
    const element = document.getElementById(id);
    if (element !== null) {
        element.textContent = getMessage(key);
    }
}
function loadContent() {
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
}
function loadNavigation() {
    const navLinks = document.querySelectorAll("[nav-link-id]");
    navLinks.forEach((link) => {
        const navLinkId = link.getAttribute("nav-link-id");
        if (navLinkId !== null) {
            link.textContent = getMessage(`nav.${navLinkId}`);
        }
    });
}
function loadFooter() {
    const footerContent = document.querySelector("[role=footer-content]") || document.getElementById("footer-content");
    if (footerContent === null) {
        return;
    }
    footerContent.textContent = getMessage("footer.text")
        .replace("{0}", String(new Date().getFullYear()));
}
async function init() {
    try {
        await loadMessages();
        await loadCaseStudies();
        await loadExperience();
        loadAboutBuildNote();
        loadNavbar();
        loadNavigation();
        loadParallax();
        loadContent();
        loadResumeButton();
        loadContactForm();
        loadFooter();
        appendCacheBusterToExistingScripts();
    }
    catch (error) {
        console.error("Unable to initialize the website:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=edsite-scripts.js.map