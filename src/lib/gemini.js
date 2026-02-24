import { GoogleGenerativeAI } from "@google/generative-ai";

// SECURITY: API Key is now moved to .env to prevent leakage on GitHub.
// Ensure VITE_GEMINI_API_KEY is set in your .env file.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

const getModel = (name = "gemini-flash-latest") => genAI.getGenerativeModel({ model: name });

const getLanguageName = (code) => {
    switch (code) {
        case 'pt': return 'Portuguese';
        case 'fi': return 'Finnish';
        case 'de': return 'German';
        case 'uk': return 'Ukrainian';
        case 'my': return 'Myanmar (Burmese)';
        default: return 'English';
    }
};

export const searchPlants = async (query, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    if (!API_KEY) {
        console.error("[Gemini] API Key missing. Please set VITE_GEMINI_API_KEY in .env");
        return [];
    }

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. The user is searching for plants related to "${query}". 
    IMPORTANT: Provide all text content in ${langName}.
    
    If ("${query}" is a full plant name or full scientific name) and (scientific_name === "${query}" or name === "${query}") Return a JSON array of up to 1 plant. 
    Else return a JSON array of up to 6 plants. 
    Each object must have:
    - "name" (common name in ${langName})
    - "popular_name" (popular name in ${langName})
    - "origin" (Origin of the plant in ${langName})
    - "type" (type of plant in ${langName})
    - "scientific_name" (complete scientific name)
    Only return the JSON array, no other text.`;

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting search with model: ${modelName} in ${langName}`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log(`[Gemini] Successfully received response from ${modelName}`);

            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] Error with ${modelName}:`, error.message);
            // if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
        }
    }
    return [];
};

export const getPlantDetails = async (scientificName, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    if (!API_KEY) return null;

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. Provide core specifications for the plant "${scientificName}".
    IMPORTANT: Provide all text content in ${langName}.
    
    Return a JSON object with the following fields (all text must be in ${langName}, except scientific_name):
    - name: The common name of the plant (in ${langName}).
    - class: The taxonomical class (e.g., Magnoliopsida).
    - order: The taxonomical order (e.g., Rosales).
    - genus: The taxonomical genus (e.g., Rosa).
    - family: The taxonomical family (e.g., Rosaceae).
    - species: The taxonomical species (e.g., Rosa canina).
    - description: A concise description with the plant type, history, origin, native climate, and interesting facts (HUD style, technical but poetic in ${langName}).
    - varieties: List known sub-species common names for "${scientificName}" (in ${langName}).
    - metadata: An object containing:
        - humidity: technical value for humidity needs.
        - gbifId: GBIF ID of the plant.
        - temperature: technical value for temperature range.
        - light: technical value for light exposure.
        - toxicity: safety level or toxicity notes.
        - toxicity_level: Level (1-5 [1=non-toxic, 2=mildly toxic, 3=moderately toxic, 4=highly toxic, 5=lethal])
        - size: technical value for maximum size (height/width) in metric units (in ${langName}).
        - type: type of plant and life cicle[anual, perene, bienal] (in ${langName}).
    - lifecycle: A JSON array of exactly 12 objects, one for each month (January to December). Each object must have:
        - month: The name of the month (in ${langName}).
        - fructification: Intensity of fruiting (0 to 10).
        - flowering: Intensity of flowering (0 to 10).
        - foliage: Intensity of leaf growth/dropping (0 to 10, where 10 is max growth, 0 is total drop).
        - pruning: Recommended pruning intensity (0 to 10).
        - is_rain_season: Boolean (true if this month is typically part of the rain season for this specimen).
        - is_sun_season: Boolean (true if this month is typically part of the sun/dry season).
    Only return the JSON object, no other text.`;

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting details with model: ${modelName} in ${langName}`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            console.log(`[Gemini] Successfully received details from ${modelName}`);

            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] Error with ${modelName}:`, error.message);
            if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
        }
    }
    return null;
};

export const getPlantTabDetails = async (scientificName, tabId, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    if (!API_KEY) return null;

    const langName = getLanguageName(language);

    let tabPrompt = "";
    switch (tabId) {

        case 'botany':
            tabPrompt = `Provide taxonomical and physical details for "${scientificName}". Return a JSON object with: "botanical_description" (a concise summary of botanical features), "foliage", "flower", "fruit", "seed","root", "stem","fragrance", "leaves","pollinationType","plantType". All text in ${langName}.`;
            break;
        case 'culinary':
            tabPrompt = `Provide specific culinary applications for "${scientificName}" in ${langName}. Return a JSON object with fields: "culinary_use" (general description), "culinary_leaves", "culinary_seeds", "culinary_fruits", "culinary_stem". If a part has no culinary use, return "NOT_APPLICABLE" for that field. For EACH part, also provide two booleans: "part_makes_tea" and "part_makes_oil". All text in ${langName}.`;
            break;
        case 'medical':
            tabPrompt = `Provide therapeutic/medicinal benefits, essential oils, and other subproducts for "${scientificName}" in ${langName}. Return a JSON object with: "therapeutic_use", "oils_and_florals", "tea" (medicinal tea), "perfume" (uses in perfumery), "soap" (uses in soaps/hygiene), "sachets" (uses in sachets/aromatics), and "other_subproducts". If a subproduct is not used, return "NOT_APPLICABLE". All text in ${langName}.`;
            break;
        case 'cultivation':
            tabPrompt = `Provide cultivation protocols for "${scientificName}" in ${langName}. Return a JSON object with: 
            "cultivation" (general summary including origin and native climate), 
            "soil" (how the soil should be mixed, organized and structured), 
            "drainage" (drainage requirements and how to achieve them), 
            "propagation" (how to make seedlings via cuttings and seeds), 
            "symbiosis" (plants that live well together/companion planting), 
            "protection" (needs for greenhouse in cold or shade in extreme sun), 
            "pruning" (method, frequency and detailed instructions), 
            "planting_season" (best months for planting). All text in ${langName}.`;
            break;
        default:
            return null;
    }

    const prompt = `Act as a botanical expert. ${tabPrompt} Only return the JSON object, no other text.`;

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
        try {
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] Tab ${tabId} error with ${modelName}:`, error.message);
        }
    }
    return null;
};
