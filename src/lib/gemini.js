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
    
    If the scientific_name is identified Return a JSON array of up to 1 plant. 
    Else return a JSON array of up to 10 plants. 
    Each object must have "name" (common name in ${langName}),"origin" (Origin of the plant in ${langName}), "type" (type of plant in ${langName}) and "scientific_name (complete scientific name)".
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
            if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
        }
    }
    return [];
};

export const getPlantDetails = async (plantName, language = 'en') => {
    if (!API_KEY) return null;

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. Provide detailed specifications for the plant "${plantName}".
    IMPORTANT: Provide all text content in ${langName}.
    
    Return a JSON object with the following fields (all text must be in ${langName}):
    - description: A detailed, high-fidelity description (HUD style, technical but poetic in ${langName}).
    - metadata: An object with "humidity", "temperature", "light", and "toxicity" (values in ${langName} if applicable).
    - image_prompt: A high-fidelity descriptive prompt for an AI image generator to create a cinematic botanical specimen image (this can remain in English for better AI compatibility).
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
