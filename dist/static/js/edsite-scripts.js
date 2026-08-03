import { loadMessages, getMessage } from "./i18n.js";
function loadNavbar() {
    const subpageNav = document.getElementById("subpage-nav");
    if (subpageNav === null) {
        return;
    }
    const menuToggle = document.querySelector("#nav-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    function closeMenu() {
        if (menuToggle === null || navMenu === null) {
            return;
        }
        menuToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
    if (menuToggle !== null && navMenu !== null) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.classList.toggle("is-open", !isOpen);
            navMenu.classList.toggle("is-open", !isOpen);
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute("aria-label", isOpen
                ? "Open navigation menu"
                : "Close navigation menu");
        });
    }
    const subpageLinks = subpageNav.querySelectorAll("a");
    subpageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const page = link.getAttribute("data-page");
            closeMenu();
            /*
             * Allow links without data-page, such as index.html,
             * to navigate normally.
             */
            if (page === null) {
                return;
            }
            event.preventDefault();
            window.location.href =
                `pages.html?page=${encodeURIComponent(page)}`;
        });
    });
    document.addEventListener("click", (event) => {
        const target = event.target instanceof Node
            ? event.target
            : null;
        if (target !== null &&
            !subpageNav.contains(target)) {
            closeMenu();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuToggle?.focus();
        }
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}
function loadPage() {
    const pageId = new URLSearchParams(window.location.search).get("page");
    if (pageId === null) {
        return;
    }
    const pageContent = document.querySelector(`[page-id="${CSS.escape(pageId)}"] section`);
    if (pageContent === null) {
        return;
    }
    pageContent.style.display = "block";
}
function loadParallax() {
    const heroImage = document.querySelector(".hero-image");
    if (heroImage === null) {
        return;
    }
    const root = document.documentElement;
    let ticking = false;
    function updateParallax() {
        root.style.setProperty("--scroll", window.scrollY.toString());
        ticking = false;
    }
    function requestParallaxUpdate() {
        if (ticking) {
            return;
        }
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    updateParallax();
}
function setText(elementId, messageKey) {
    const element = document.getElementById(elementId);
    if (element === null) {
        return;
    }
    element.textContent = getMessage(messageKey);
}
function loadContent() {
    setText("hero-title", "hero.title");
    setText("about-title", "about.title");
    setText("about-description", "about.description");
    setText("about-button", "CTA.about");
    setText("projects-title", "projects.title");
    setText("projects-description", "projects.description");
    setText("projects-button", "CTA.projects");
    setText("contact-title", "contact.title");
    setText("contact-description", "contact.description");
    setText("contact-button", "CTA.contact");
    const heroTagline = document.querySelector(".hero-tagline");
    const heroDescription = document.querySelector(".hero-description");
    const heroButton = document.querySelector(".hero-button");
    if (heroTagline !== null) {
        heroTagline.textContent =
            getMessage("hero.tagline");
    }
    if (heroDescription !== null) {
        heroDescription.textContent =
            getMessage("hero.description");
    }
    if (heroButton !== null) {
        heroButton.textContent =
            getMessage("hero.button");
    }
}
function loadFooter() {
    const footerContent = document.getElementById("footer-content");
    if (footerContent === null) {
        return;
    }
    footerContent.textContent = getMessage("footer.text", new Date().getFullYear().toString());
}
async function init() {
    try {
        await loadMessages("en");
        loadNavbar();
        loadPage();
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