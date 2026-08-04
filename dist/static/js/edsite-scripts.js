import { loadMessages, getMessage } from "./i18n.js";
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
        if (target !== null && !navElement.contains(target)) {
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
    return urlParams.get("page") || "home";
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
        ["contact-button", "CTA.contact"]
    ].forEach(([id, key]) => setText(id, key));
    const pageidelement = document.querySelector("[page-id]");
    if (pageidelement) {
        pageidelement.setAttribute("page-id", pageId());
    }
    else {
        throw new Error("Unable to find page-id element");
    }
    const pageTitle = document.getElementById("page-title");
    const subpageHeroTitle = document.getElementById("subpage-hero-title");
    if (pageTitle !== null) {
        pageTitle.textContent = getMessage(`page.${pageId()}.title`);
    }
    if (subpageHeroTitle !== null) {
        subpageHeroTitle.innerHTML = getMessage(`page.${pageId()}.title`);
    }
}
function loadFooter() {
    const footer = document.querySelector("[role=footer-content]");
    if (footer !== null) {
        footer.textContent = getMessage("footer.text");
    }
}
async function init() {
    try {
        await loadMessages();
        loadNavbar();
        loadParallax();
        loadContent();
        loadFooter();
    }
    catch (error) {
        console.error("Unable to initialize the website:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=edsite-scripts.js.map