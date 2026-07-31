import { loadMessages, getMessage } from "./i18n";
function loadFooter() {
    const footerContent = document.getElementById("footer-content");
    if (footerContent === null) {
        return;
    }
    footerContent.textContent = getMessage("footer.text", new Date().getFullYear().toString());
}
async function init() {
    await loadMessages("en");
    loadFooter();
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=edsite-scripts.js.map