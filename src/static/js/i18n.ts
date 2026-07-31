const messages = new Map<string, string>();

export async function loadMessages(locale = "en"): Promise<void> {
    const response = await fetch(`/src/static/language/messages.${locale}.properties`);

    if (!response.ok) {
        throw new Error(`Unable to load messages.${locale}.properties`);
    }

    const text = await response.text();

    text.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();

        if (
            trimmed.length === 0 ||
            trimmed.startsWith("#") ||
            trimmed.startsWith("!")
        ) {
            return;
        }

        const index = trimmed.indexOf("=");

        if (index === -1) {
            return;
        }

        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();

        messages.set(key, value);
    });
}

export function getMessage(key: string, ...args: string[]): string {
    let value = messages.get(key) ?? key;

    args.forEach((arg, index) => {
        value = value.replace(`{${index}}`, arg);
    });

    return value;
}