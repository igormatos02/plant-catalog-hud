const PLANTNET_API_KEY = import.meta.env.VITE_PLANTNET_API_KEY;

/**
 * Align a botanical specimen with the PlantNet database using its scientific name.
 * @param {string} scientificName - The scientific name to search for.
 * @returns {Promise<object|null>} - The best matching species object or null.
 */
export const alignSpecies = async (scientificName) => {
    // 1. Try PlantNet Alignment (Requires CORS authorization in dashboard)
    if (PLANTNET_API_KEY) {
        try {
            const url = `https://my.plantnet.org/api/v2/projects/all/species/align?name=${encodeURIComponent(scientificName)}&api-key=${PLANTNET_API_KEY}&fuzzy=true`;
            console.log(`[PlantNet] Attempting alignment: ${scientificName}`);

            /*const response = await fetch(url);
            if (response.ok) {
                const results = await response.json();
                if (results && results.length > 0) {
                    console.log(`[PlantNet] Alignment success: ${results[0].scientificName}`);
                    return results[0];
                }
            }*/
        } catch (error) {
            console.warn("[PlantNet] Alignment blocked or failed (CORS?):", error.message);
        }
    }

    // 2. Fallback to GBIF Match (CORS-friendly, zero-config)
    try {
        console.log(`[GBIF] Running recovery alignment: ${scientificName}`);
        const gbifUrl = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}&strict=false`;
        const response = await fetch(gbifUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.usageKey) {
                console.log(`[GBIF] Specimen aligned via GBIF Registry: ${data.scientificName}`);
                return {
                    scientificName: data.scientificName,
                    gbifId: data.usageKey
                };
            }
        }
    } catch (error) {
        console.error("[GBIF] Recovery alignment failed:", error.message);
    }

    return null;
};

/**
 * Fetch real specimen imagery from GBIF using a taxon key.
 * @param {string} gbifId - The GBIF ID for the species.
 * @returns {Promise<string|null>} - A URL for a real specimen photo.
 */
export const fetchSpecimenImage = async (gbifId, variety) => {
    if (!gbifId) return [];

    console.log(`[GBIF] Resolving imagery for taxon: ${gbifId}${variety ? ` (${variety})` : ''}`);

    try {
        const url = `https://api.gbif.org/v1/occurrence/search?taxonKey=${gbifId}&mediaType=StillImage&limit=25`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const urls = data.results
                .flatMap(result => (result.media || []).map(m => m.identifier))
                .filter(url => url && typeof url === 'string');

            // Unique URLs only, capped at 15
            const uniqueUrls = [...new Set(urls)].slice(0, 15);
            console.log(`[GBIF] Resolved ${uniqueUrls.length} unique specimen images.`);
            return uniqueUrls;
        }
    } catch (error) {
        console.error("[GBIF] Imagery resolution failure:", error.message);
    }
    return [];
};
