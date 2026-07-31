import { loadMessages, getMessage } from "./i18n";

function loadFooter(): void {
    const footerContent: HTMLElement | null =
        document.getElementById("footer-content");

    if (footerContent === null) {
        return;
    }

    footerContent.textContent = getMessage(
        "footer.text",
        new Date().getFullYear().toString()
    );
}

async function init(): Promise<void> {
    await loadMessages("en");
    loadFooter();
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});