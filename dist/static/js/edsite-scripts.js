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
            menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        });
    }
    const subpageLinks = subpageNav.querySelectorAll("a");
    subpageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const page = link.getAttribute("data-page");
            closeMenu();
            // Allow links such as index.html to navigate normally.
            if (page === null) {
                return;
            }
            event.preventDefault();
            window.location.href = `pages.html?page=${encodeURIComponent(page)}`;
        });
    });
    document.addEventListener("click", (event) => {
        const target = event.target instanceof Node ? event.target : null;
        if (target !== null && !subpageNav.contains(target)) {
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
    const pageContent = document.querySelector("[page-id='" + pageId + "'] section");
    if (pageContent === null) {
        return;
    }
    pageContent.style.display = "block";
}
function loadFooter() {
    const footerContent = document.querySelector("[role='footer-content']");
    if (footerContent === null) {
        return;
    }
    footerContent.textContent = getMessage("footer.text", new Date().getFullYear().toString());
}
function loadContent() {
    const hero = document.getElementById("hero-content");
    const about = document.getElementById("about-content");
    const projects = document.getElementById("projects-content");
    const contact = document.getElementById("contact-content");
    if (hero === null || about === null || projects === null || contact === null) {
        return;
    }
    hero.innerHTML = `<h1>${getMessage("hero.title")}</h1>
    <p>${getMessage("hero.description")}</p>`;
    about.innerHTML = `<h2>${getMessage("about.title")}</h2>
    <p>${getMessage("about.description")}</p>
    <button onclick="window.location.href='pages.html?page=about'">${getMessage("CTA.about")}</button>`;
    projects.innerHTML = `<h2>${getMessage("projects.title")}</h2>
    <p>${getMessage("projects.description")}</p>
    <button onclick="window.location.href='pages.html?page=projects'">${getMessage("CTA.projects")}</button>`;
    contact.innerHTML = `<h2>${getMessage("contact.title")}</h2>
    <p>${getMessage("contact.description")}</p>
    <button onclick="window.location.href='pages.html?page=contact'">${getMessage("CTA.contact")}</button>`;
}
async function init() {
    await loadMessages("en");
    loadNavbar();
    loadPage();
    loadContent();
    loadFooter();
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=edsite-scripts.js.map