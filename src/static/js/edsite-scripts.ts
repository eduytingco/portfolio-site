import { loadMessages, getMessage } from "./i18n.js";

function loadNavbar(): void {
    const subpageNav: HTMLElement | null =
        document.getElementById("subpage-nav");

    if (subpageNav === null) {
        return;
    }

    const menuToggle: HTMLButtonElement | null =
        document.querySelector<HTMLButtonElement>("#nav-menu-toggle");

    const navMenu: HTMLElement | null =
        document.getElementById("nav-menu");

    function closeMenu(): void {
        if (menuToggle === null || navMenu === null) {
            return;
        }

        menuToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    if (menuToggle !== null && navMenu !== null) {
        menuToggle.addEventListener("click", () => {
            const isOpen: boolean =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.classList.toggle("is-open", !isOpen);
            navMenu.classList.toggle("is-open", !isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Open navigation menu"
                    : "Close navigation menu"
            );
        });
    }

    const subpageLinks: NodeListOf<HTMLAnchorElement> =
        subpageNav.querySelectorAll<HTMLAnchorElement>("a");

    subpageLinks.forEach((link) => {
        link.addEventListener("click", (event: MouseEvent) => {
            const page: string | null =
                link.getAttribute("data-page");

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

    document.addEventListener("click", (event: MouseEvent) => {
        const target: Node | null =
            event.target instanceof Node
                ? event.target
                : null;

        if (
            target !== null &&
            !subpageNav.contains(target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
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

function loadPage(): void {
    const pageId: string | null =
        new URLSearchParams(window.location.search).get("page");

    if (pageId === null) {
        return;
    }

    const pageContent: HTMLElement | null =
        document.querySelector<HTMLElement>(
            `[page-id="${CSS.escape(pageId)}"] section`
        );

    if (pageContent === null) {
        return;
    }

    pageContent.style.display = "block";
}

function loadParallax(): void {
    const heroImage: HTMLImageElement | null =
        document.querySelector<HTMLImageElement>(".hero-image");

    if (heroImage === null) {
        return;
    }

    const root: HTMLElement =
        document.documentElement;

    let ticking = false;

    function updateParallax(): void {
        root.style.setProperty(
            "--scroll",
            window.scrollY.toString()
        );

        ticking = false;
    }

    function requestParallaxUpdate(): void {
        if (ticking) {
            return;
        }

        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }

    window.addEventListener(
        "scroll",
        requestParallaxUpdate,
        { passive: true }
    );

    updateParallax();
}

function setText(
    elementId: string,
    messageKey: string
): void {
    const element: HTMLElement | null =
        document.getElementById(elementId);

    if (element === null) {
        return;
    }

    element.textContent = getMessage(messageKey);
}

function loadContent(): void {
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

    const heroTagline: HTMLElement | null =
        document.querySelector<HTMLElement>(".hero-tagline");

    const heroDescription: HTMLElement | null =
        document.querySelector<HTMLElement>(".hero-description");

    const heroButton: HTMLAnchorElement | null =
        document.querySelector<HTMLAnchorElement>(".hero-button");

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
    try {
        await loadMessages("en");

        loadNavbar();
        loadPage();
        loadParallax();
        loadContent();
        loadFooter();
    } catch (error: unknown) {
        console.error(
            "Unable to initialize the website:",
            error
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});