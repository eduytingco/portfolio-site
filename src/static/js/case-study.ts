import { loadMessages } from "./i18n.js";
import { loadCaseStudyData, findCaseStudy, type CaseStudy } from "./case-study-data.js";

function caseStudyIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function renderConstraints(caseStudy: CaseStudy): void {
    const container = document.getElementById("case-study-constraints");
    if (container === null) {
        return;
    }

    container.replaceChildren(
        ...caseStudy.constraints.map((constraint) => {
            const box = document.createElement("div");
            box.className = "constraint-box";

            const title = document.createElement("div");
            title.className = "title";
            title.textContent = constraint.title;

            const desc = document.createElement("div");
            desc.className = "desc";
            desc.textContent = constraint.desc;

            box.append(title, desc);
            return box;
        })
    );
}

function setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element !== null) {
        element.textContent = value;
    }
}

async function loadCaseStudyDetail(): Promise<void> {
    const id = caseStudyIdFromUrl();
    if (id === null) {
        return;
    }

    const caseStudies = await loadCaseStudyData();
    const caseStudy = findCaseStudy(caseStudies, id);
    if (caseStudy === undefined) {
        return;
    }

    const image = document.getElementById("case-study-image");
    if (image instanceof HTMLImageElement) {
        image.src = caseStudy.image;
        image.alt = caseStudy.title;
    }

    setText("case-study-title", caseStudy.title);
    setText("case-study-subtitle", caseStudy.subtitle);
    setText("case-study-problem", caseStudy.problem);
    setText("case-study-approach", caseStudy.approach);
    setText("case-study-result", caseStudy.result);
    setText("case-study-reflection", caseStudy.reflection);

    renderConstraints(caseStudy);

    document.title = caseStudy.title;
}

async function init(): Promise<void> {
    try {
        await loadMessages();
        await loadCaseStudyDetail();
    } catch (error: unknown) {
        console.error("Unable to initialize case study page:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    void init();
});