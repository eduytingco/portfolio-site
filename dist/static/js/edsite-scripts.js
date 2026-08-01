import { loadMessages, getMessage } from "./i18n.js";
function loadFooter() {
    const footerContent = document.getElementById("footer-content");
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
    <p>${getMessage("about.description")}</p>`;
    projects.innerHTML = `<h2>${getMessage("projects.title")}</h2>
    <p>${getMessage("projects.description")}</p>`;
    contact.innerHTML = `<h2>${getMessage("contact.title")}</h2>
    <p>${getMessage("contact.description")}</p>`;
}
async function init() {
    await loadMessages("en");
    loadContent();
    loadFooter();
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=edsite-scripts.js.map