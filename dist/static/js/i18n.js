const messages = new Map();
function parseProperties(content) {
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#") || line.startsWith("!")) {
            continue;
        }
        const separator = line.search(/[:=]/);
        if (separator === -1) {
            continue;
        }
        messages.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
    }
}
export async function loadMessages(locale) {
    const response = await fetch(`../../src/static/language/messages.${locale}.properties`);
    if (!response.ok) {
        throw new Error(`Unable to load messages: ${response.status} ${response.statusText}`);
    }
    parseProperties(await response.text());
}
export function getMessage(key, ...values) {
    let message = messages.get(key) ?? key;
    values.forEach((value, index) => {
        message = message.replace(`{${index}}`, value);
    });
    return message;
}
//# sourceMappingURL=i18n.js.map