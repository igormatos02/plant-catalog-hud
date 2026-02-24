import { GoogleGenerativeAI } from "@google/generative-ai";

// SECURITY: API Key is now moved to .env to prevent leakage on GitHub.
// Ensure VITE_GEMINI_API_KEY is set in your .env file.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "DUMMY_KEY");

const getModel = (name = "gemini-2.5-flash") => genAI.getGenerativeModel({ model: name });

const getLanguageName = (code) => {
    switch (code) {
        case 'pt': return 'Portuguese';
        case 'fi': return 'Finnish';
        case 'de': return 'German';
        case 'uk': return 'Ukrainian';
        default: return 'English';
    }
};

export const searchPlants = async (query, language = 'en') => {
    if (!API_KEY) {
        console.error("[Gemini] API Key missing. Please set VITE_GEMINI_API_KEY in .env");
        return [];
    }

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. The user is searching for plants related to "${query}". 
    IMPORTANT: Provide all text content in ${langName}.
    
    If ("${query}" is a full plant name or full scientific name) and (scientific_name === "${query}" or name === "${query}") Return a JSON array of up to 1 plant. 
    Else return a JSON array of up to 10 plants. 
    Each object must have:
    - "name" (common name in ${langName})
    - "popular_name" (popular name in ${langName})
    - "origin" (Origin of the plant in ${langName})
    - "type" (type of plant in ${langName})
    - "scientific_name" (complete scientific name)
    Only return the JSON array, no other text.`;

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];

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

export const getPlantDetails = async (scientificName, language = 'en') => {
    if (!API_KEY) return null;

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. Provide detailed specifications for the plant "${scientificName}".
    IMPORTANT: Provide all text (7 lines) content in ${langName}.
    
    Return a JSON object with the following fields (all text must be in ${langName}, except scientific_name):
    - name: The common name of the plant (in ${langName}).
    - class: The taxonomical class (e.g., Magnoliopsida).
    - family: The taxonomical family (e.g., Rosaceae).
    - description: A description with the plant type, origin, interesting facts, description of the plant leaf, flower, fruit, stem, roots, and seeds (HUD style, technical but poetic in ${langName}).
    - metadata: An object containing:
        - humidity: technical value for humidity needs.
        - temperature: technical value for temperature range.
        - light: technical value for light exposure.
        - toxicity: Level (1-5 [1=non-toxic, 2=mildly toxic, 3=moderately toxic, 4=highly toxic, 5=lethal]) and safety level or toxicity notes.
        - culinary_use: specific culinary applications (if none, state "None observed").
        - therapeutic_use: medicinal/therapeutic properties.
        - oils_and_florals: information about essential oils or floral uses.
        - cultivation: brief cultivation summary.
        - size: expected dimensions/growth height.
        - planting_season: ideal months or seasons for planting/harvesting.
        - pruning: pruning technical frequency or method.
    Only return the JSON object, no other text.`;

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];

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
