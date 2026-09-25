let cachedCaseStudies = null;
export async function loadCaseStudyData() {
    if (cachedCaseStudies !== null) {
        return cachedCaseStudies;
    }
    const response = await fetch("/src/data/case-studies.json");
    if (!response.ok) {
        throw new Error("Failed to load case studies");
    }
    cachedCaseStudies = await response.json();
    return cachedCaseStudies;
}
export function findCaseStudy(caseStudies, id) {
    return caseStudies.find((caseStudy) => caseStudy.id === id);
}
//# sourceMappingURL=case-study-data.js.map