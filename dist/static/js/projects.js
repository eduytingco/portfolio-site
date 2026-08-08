import { loadCaseStudyData } from "./case-study-data.js";
function renderCaseStudyCard(caseStudy) {
    const card = document.createElement("a");
    card.className = "case-study-card";
    card.href = `/case-study.html?id=${caseStudy.id}`;
    const img = document.createElement("img");
    img.className = "case-study-card-image";
    img.src = caseStudy.image;
    img.alt = caseStudy.title;
    img.loading = "lazy";
    const body = document.createElement("div");
    body.className = "case-study-card-body";
    const title = document.createElement("h3");
    title.className = "case-study-card-title";
    title.textContent = caseStudy.title;
    const summary = document.createElement("p");
    summary.className = "case-study-card-summary";
    summary.textContent = caseStudy.problem;
    const tagList = document.createElement("div");
    tagList.className = "case-study-card-tags";
    caseStudy.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "case-study-card-tag";
        tagEl.textContent = getMessage(`tag.${tag}`);
        tagList.appendChild(tagEl);
    });
    body.append(title, summary, tagList);
    card.append(img, body);
    return card;
}
async function loadCaseStudies() {
    if (pageId() !== "projects") {
        return;
    }
    const grid = document.getElementById("subpage-sample-content");
    if (grid === null) {
        return;
    }
    try {
        const caseStudies = await loadCaseStudyData();
        grid.replaceChildren(...caseStudies.map(renderCaseStudyCard));
    }
    catch (error) {
        console.error("Unable to load case studies:", error);
    }
}
//# sourceMappingURL=projects.js.map