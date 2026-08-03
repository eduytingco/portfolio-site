import { loadMessages, getMessage } from "./i18n.js";
function loadNavbar() {
    const subpageNav = document.getElementById("subpage-nav");
    if (subpageNav === null) {
        return;
    }
    // Logo click -> Home page
    const navLogo = document.getElementById("nav-logo");
    if (navLogo !== null) {
        navLogo.style.cursor = "pointer";
        navLogo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
        // Optional: keyboard accessibility if the SVG isn't already inside a link
        navLogo.setAttribute("tabindex", "0");
        navLogo.setAttribute("role", "link");
        navLogo.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = "index.html";
            }
        });
    }
    const subpageLinks = document.querySelectorAll("#subpage-nav a");
    subpageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const page = link.getAttribute("data-page");
            // Allow Home link to navigate normally
            if (page === null) {
                return;
            }
            event.preventDefault();
            window.location.href = `pages.html?page=${page}`;
        });
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