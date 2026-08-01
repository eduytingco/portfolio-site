import { loadMessages, getMessage } from "./i18n.js";

function loadNavbar(): void {
    const subpageNav: HTMLElement | null =
        document.getElementById("subpage-nav");

    if (subpageNav === null) {
        return;
    }

    const subpageLinks: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll("#subpage-nav a");

    subpageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = link.getAttribute("data-page") ?? "";
            window.location.href = `pages.html?page=${page}`;
        });
    });
}
function loadPage(): void {
    const pageId: string | null = new URLSearchParams(window.location.search).get("page");
    const pageContent: HTMLElement | null =
        document.querySelector("[page-id='" + pageId + "'] section");

    if (pageContent === null) {
        return;
    }

    pageContent.style.display = "block";
}
function loadFooter(): void {
    const footerContent: HTMLElement | null =
        document.querySelector("[role='footer-content']");

    if (footerContent === null) {
        return;
    }

    footerContent.textContent = getMessage(
        "footer.text",
        new Date().getFullYear().toString()
    );
}
function loadContent(): void {
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
    <button onclick="window.location.href='pages.html?page=about'">Learn More</button>`;
    projects.innerHTML = `<h2>${getMessage("projects.title")}</h2>
    <p>${getMessage("projects.description")}</p>
    <button onclick="window.location.href='pages.html?page=projects'">View Projects</button>`;
    contact.innerHTML = `<h2>${getMessage("contact.title")}</h2>
    <p>${getMessage("contact.description")}</p>
    <button onclick="window.location.href='pages.html?page=contact'">Contact Me</button>`;
}
async function init(): Promise<void> {
    await loadMessages("en");
    loadNavbar();
    loadPage();
    loadContent();
    loadFooter();
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});