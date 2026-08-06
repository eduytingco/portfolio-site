const messages: Map<string, string> = new Map<string, string>();

function parseProperties(content: string): Map<string, string> {
    const parsedMessages: Map<string, string> =
        new Map<string, string>();

    content.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine: string = line.trim();

        if (
            trimmedLine.length === 0 ||
            trimmedLine.startsWith("#") ||
            trimmedLine.startsWith("!")
        ) {
            return;
        }

        const separatorIndex: number = trimmedLine.search(/[=:]/);

        if (separatorIndex === -1) {
            return;
        }

        const key: string = trimmedLine
            .slice(0, separatorIndex)
            .trim();

        const value: string = trimmedLine
            .slice(separatorIndex + 1)
            .trim()
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\=/g, "=")
            .replace(/\\:/g, ":");

        if (key.length > 0) {
            parsedMessages.set(key, value);
        }
    });

    return parsedMessages;
}

export async function loadMessages(): Promise<void> {
    const response: Response = await fetch(
        "/src/static/language/messages.en.properties",
        {
            cache: "no-cache",
        },
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load messages: ${response.status} ${response.statusText}`,
        );
    }

    const content: string = await response.text();
    const parsedMessages: Map<string, string> =
        parseProperties(content);

    messages.clear();

    parsedMessages.forEach((value: string, key: string) => {
        messages.set(key, value);
    });

    console.info(`Loaded ${messages.size} language messages.`);
}

export function getMessage(key: string): string {
    const message: string | undefined = messages.get(key);

    if (message === undefined) {
        console.warn(`Missing message key: ${key}`);
        return key;
    }

    return message;
}

export function cacheBuster(): string {
    return new Date().getTime().toString();
}

export function appendCacheBusterToExistingScripts() {
  const scripts = document.querySelectorAll('script');
  const cacheBuster = Date.now();

  scripts.forEach(script => {
    if (script.src) {
      const separator = script.src.includes('?') ? '&' : '?';
      script.src = `${script.src}${separator}v=${cacheBuster}`;
    }
  });
}