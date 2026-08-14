export interface Experience {
    id: string;
    company: string;
    title: string;
    dates: string;
    summary: string;
    bullets: string[];
    stack: string[];
}

let cachedExperience: Experience[] | null = null;

export async function loadExperienceData(): Promise<Experience[]> {
    if (cachedExperience !== null) {
        return cachedExperience;
    }

    const response = await fetch("/src/data/experience-data.json");
    if (!response.ok) {
        throw new Error("Failed to load experience data");
    }

    cachedExperience = await response.json() as Experience[];
    return cachedExperience;
}

export function findExperience(entries: Experience[], id: string): Experience | undefined {
    return entries.find((entry) => entry.id === id);
}