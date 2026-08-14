import { loadMessages } from "./i18n.js";
import { loadExperienceData } from "./experience-data.js";
function renderStack(stack) {
    const list = document.createElement("ul");
    list.className = "stack-list";
    list.append(...stack.map((item) => {
        const tag = document.createElement("li");
        tag.className = "stack-tag";
        tag.textContent = item;
        return tag;
    }));
    return list;
}
function renderBullets(experience) {
    const list = document.createElement("ul");
    list.className = "bullet-list";
    list.append(...experience.bullets.map((bullet, index) => {
        const item = document.createElement("li");
        item.className = "bullet";
        const text = document.createElement("span");
        text.className = "bullet-text";
        text.textContent = bullet;
        item.append(text);
        const link = experience.links[index];
        if (link !== undefined) {
            const anchor = document.createElement("a");
            anchor.className = "bullet-link";
            anchor.href = `case-study.html?id=${encodeURIComponent(link.slug)}`;
            anchor.textContent = link.label;
            item.append(anchor);
        }
        return item;
    }));
    return list;
}
function renderExperienceEntry(experience) {
    const entry = document.createElement("article");
    entry.className = "experience-entry";
    entry.id = `experience-${experience.id}`;
    const header = document.createElement("div");
    header.className = "experience-header";
    const company = document.createElement("div");
    company.className = "company";
    company.textContent = experience.company;
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = experience.title;
    const dates = document.createElement("div");
    dates.className = "dates";
    dates.textContent = experience.dates;
    header.append(company, title, dates);
    const summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = experience.summary;
    entry.append(header, summary, renderBullets(experience), renderStack(experience.stack));
    return entry;
}
function renderExperienceList(entries) {
    const container = document.getElementById("experience-list");
    if (container === null) {
        return;
    }
    container.replaceChildren(...entries.map(renderExperienceEntry));
}
async function loadExperiencePage() {
    const entries = await loadExperienceData();
    renderExperienceList(entries);
}
async function init() {
    try {
        await loadMessages();
        await loadExperiencePage();
    }
    catch (error) {
        console.error("Unable to initialize experience page:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    void init();
});
//# sourceMappingURL=experience.js.map