import { getMessage } from "./i18n.js";

function pageId(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "home";
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

    form.append(submitWrapper, status);

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