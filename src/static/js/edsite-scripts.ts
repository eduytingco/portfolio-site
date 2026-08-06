import { loadMessages, getMessage, appendCacheBusterToExistingScripts } from "./i18n.js";

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

function pageId(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "home";
}

function setText(id: string, key: string): void {
    const element = document.getElementById(id);
    if (element !== null) {
        element.textContent = getMessage(key);
    }
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
        ["nav-contact", "nav.contact"]

    ].forEach(([id, key]) => setText(id, key));
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

function loadNavigation(): void {
    const navLinks = document.querySelectorAll("[nav-link-id]");
    navLinks.forEach((link) => {
        const navLinkId = link.getAttribute("nav-link-id");
        if (navLinkId !== null) {
            link.textContent = getMessage(`nav.${navLinkId}`);
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
        loadNavbar();
        loadNavigation();
        loadParallax();
        loadContent();
        loadFooter();
        appendCacheBusterToExistingScripts();
    } catch (error: unknown) {
        console.error("Unable to initialize the website:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});
