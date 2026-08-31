export interface CaseStudyConstraint {
    title: string;
    desc: string;
}

export interface CaseStudy {
    id: string;
    image: string;
    tags: string[];
    title: string;
    subtitle: string;
    problem: string;
    constraints: CaseStudyConstraint[];
    approach: string;
    result: string;
    reflection: string;
}

let cachedCaseStudies: CaseStudy[] | null = null;

export async function loadCaseStudyData(): Promise<CaseStudy[]> {
    if (cachedCaseStudies !== null) {
        return cachedCaseStudies;
    }

    const response = await fetch("/src/data/case-studies.json");
    if (!response.ok) {
        throw new Error("Failed to load case studies");
    }

    cachedCaseStudies = await response.json() as CaseStudy[];
    return cachedCaseStudies;
}

export function findCaseStudy(caseStudies: CaseStudy[], id: string): CaseStudy | undefined {
    return caseStudies.find((caseStudy) => caseStudy.id === id);
}
