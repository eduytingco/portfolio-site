import { getMessage } from "./i18n.js";

function pageId(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const queryPage = urlParams.get("page");
    if (queryPage !== null) {
        return queryPage;
    }

    const pathMatch = window.location.pathname.match(/\/([a-z-]+)\.html$/);
    if (pathMatch !== null && pathMatch[1] !== "index" && pathMatch[1] !== "pages") {
        return pathMatch[1];
    }

    return "home";
}

interface ContactField {
    id: string;
    name: string;
    labelKey: string;
    type: "text" | "email" | "textarea";
    validate: (value: string) => string | null; // returns a message key, or null if valid
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredValidator(value: string): string | null {
    return value.trim() === "" ? "contact.form.error.required" : null;
}

function emailValidator(value: string): string | null {
    if (value.trim() === "") {
        return "contact.form.error.required";
    }
    return EMAIL_PATTERN.test(value) ? null : "contact.form.error.email";
}

const CONTACT_FIELDS: ContactField[] = [
    { id: "contact-name", name: "name", labelKey: "contact.form.name", type: "text", validate: requiredValidator },
    { id: "contact-email", name: "email", labelKey: "contact.form.email", type: "email", validate: emailValidator },
    { id: "contact-message", name: "message", labelKey: "contact.form.message", type: "textarea", validate: requiredValidator }
];

interface BuiltField {
    wrapper: HTMLElement;
    input: HTMLInputElement | HTMLTextAreaElement;
    errorEl: HTMLElement;
    validate: (value: string) => string | null;
}

function buildField(field: ContactField): BuiltField {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = getMessage(field.labelKey);

    const input =
        field.type === "textarea"
            ? document.createElement("textarea")
            : document.createElement("input");

    input.id = field.id;
    input.setAttribute("name", field.name);
    input.setAttribute("required", "");

    if (input instanceof HTMLInputElement) {
        input.type = field.type;
    } else {
        input.setAttribute("rows", "5");
    }

    const errorEl = document.createElement("span");
    errorEl.className = "field-error-message";
    errorEl.setAttribute("role", "alert");

    // Clear the error as soon as the person starts fixing it
    input.addEventListener("input", () => {
        clearFieldError(wrapper, input, errorEl);
    });

    wrapper.append(label, input, errorEl);

    return { wrapper, input, errorEl, validate: field.validate };
}

function setFieldError(wrapper: HTMLElement, input: HTMLElement, errorEl: HTMLElement, messageKey: string): void {
    wrapper.classList.add("has-error");
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = getMessage(messageKey);
}

function clearFieldError(wrapper: HTMLElement, input: HTMLElement, errorEl: HTMLElement): void {
    wrapper.classList.remove("has-error");
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
}

function buildSocialLink(href: string, iconPath: string, labelId: string, labelKey: string): HTMLElement {
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";

    link.innerHTML = `<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="${iconPath}"/>
    </svg>`;

    const label = document.createElement("span");
    label.id = labelId;
    label.textContent = getMessage(labelKey);
    link.append(label);

    return link;
}

const LINKEDIN_ICON_PATH = "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z";
const GITHUB_ICON_PATH = "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z";

function buildContactSocialLink(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "contact-social";

    wrapper.append(
        buildSocialLink(
            "https://www.linkedin.com/in/eduytingco/",
            LINKEDIN_ICON_PATH,
            "contact-linkedin-label",
            "contact.linkedin"
        ),
        buildSocialLink(
            "https://github.com/eduytingco/portfolio-site",
            GITHUB_ICON_PATH,
            "contact-github-label",
            "contact.github"
        )
    );

    return wrapper;
}

function buildContactForm(): HTMLFormElement {
    const form = document.createElement("form");
    const submitWrapper = document.createElement("div");
    submitWrapper.className = "form-field";
    submitWrapper.className += " form-field-submit";
    form.id = "contact-form";
    form.action = "https://formspree.io/f/xkjwoenq";
    form.method = "POST";
    form.setAttribute("novalidate", ""); // we handle validation ourselves

    const builtFields = CONTACT_FIELDS.map(buildField);
    builtFields.forEach(({ wrapper }) => form.appendChild(wrapper));

    const submitButton = document.createElement("button");
    submitButton.id = "contact-form-submit";
    submitButton.type = "submit";
    submitButton.textContent = getMessage("contact.form.submit");
    submitWrapper.appendChild(submitButton);

    const status = document.createElement("p");
    status.id = "contact-form-status";
    status.className = "field-error-message";
    status.setAttribute("role", "status");

    form.append(submitWrapper, status, buildContactSocialLink());

    function validateAll(): boolean {
        let isValid = true;
        let firstInvalid: HTMLElement | null = null;

        builtFields.forEach(({ wrapper, input, errorEl, validate }) => {
            const messageKey = validate(input.value);
            if (messageKey !== null) {
                setFieldError(wrapper, input, errorEl, messageKey);
                isValid = false;
                if (firstInvalid === null) {
                    firstInvalid = input;
                }
            } else {
                clearFieldError(wrapper, input, errorEl);
            }
        });

        status.classList.toggle("invalid", !isValid);

        if (firstInvalid !== null) {
            (firstInvalid as HTMLElement).focus();
        }

        return isValid;
    }

    form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();

        if (!validateAll()) {
            status.textContent = getMessage("contact.form.error.formInvalid");
            return;
        }

        submitButton.disabled = true;
        status.textContent = getMessage("contact.form.sending");

        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { "Accept": "application/json" }
        })
            .then((response) => {
                if (response.ok) {
                    status.textContent = getMessage("contact.form.success");
                    form.reset();
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .catch(() => {
                status.textContent = getMessage("contact.form.error.submitFailed");
            })
            .finally(() => {
                submitButton.disabled = false;
            });
    });

    return form;
}

export function loadContactForm(): void {
    if (pageId() !== "contact") {
        return;
    }

    const container = document.getElementById("subpage-insta-content");
    if (container === null) {
        return;
    }

    container.replaceChildren(buildContactForm());
}