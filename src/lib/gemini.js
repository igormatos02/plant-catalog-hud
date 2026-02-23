import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyD3A1kg6xmGXpASkNI2H6vwdpirm6avkdk';
const genAI = new GoogleGenerativeAI(API_KEY);

const getModel = (name = "gemini-1.5-flash") => genAI.getGenerativeModel({ model: name });

export const searchPlants = async (query) => {
    const prompt = `Act as a botanical expert. The user is searching for plants related to "${query}". 
    Return a JSON array of up to 100 plants. 
    Each object must have "name" (common name) and "scientific_name".
    Only return the JSON array, no other text.`;

    // Added 2.5-flash based on model list verification
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-pro"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting search with model: ${modelName}`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] Search failed with ${modelName}:`, error.message);
            if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
        }
    }
    return [];
};

export const getPlantDetails = async (plantName) => {
    const prompt = `Act as a botanical expert. Provide detailed specifications for the plant "${plantName}".
    Return a JSON object with the following fields:
    - description: A detailed, high-fidelity description (HUD style, technical but poetic).
    - metadata: An object with "humidity", "temperature", "light", and "toxicity".
    - image_prompt: A high-fidelity descriptive prompt for an AI image generator to create a cinematic botanical specimen image.
    Only return the JSON object, no other text.`;

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting details with model: ${modelName}`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] Details failed with ${modelName}:`, error.message);
            if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
        }
    }
    return null;
};
