let cachedExperience = null;
export async function loadExperienceData() {
    if (cachedExperience !== null) {
        return cachedExperience;
    }
    const response = await fetch("/src/data/experience-data.json");
    if (!response.ok) {
        throw new Error("Failed to load experience data");
    }
    cachedExperience = await response.json();
    return cachedExperience;
}
export function findExperience(entries, id) {
    return entries.find((entry) => entry.id === id);
}
//# sourceMappingURL=experience-data.js.map