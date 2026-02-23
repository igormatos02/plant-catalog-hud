import OpenAI from 'openai';

// SECURITY: API Key moved to environment variables to prevent leakage.
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const openai = new OpenAI({
    apiKey: API_KEY || "DUMMY_KEY",
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true // Essential for client-side use in Vite
});

export const searchPlants = async (query) => {
    if (!API_KEY) {
        console.error("[DeepSeek] API Key missing. Please set VITE_DEEPSEEK_API_KEY in .env");
        return [];
    }

    const prompt = `Act as a botanical expert. The user is searching for plants related to "${query}". 
Return a JSON array of up to 100 plants. 
Each object must have "name" (common name) and "scientific_name".
Return ONLY the JSON array. No markdown blocks, no preamble.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' } // DeepSeek supports JSON mode
        });

        const content = response.choices[0].message.content;
        const data = JSON.parse(content);
        return Array.isArray(data) ? data : (data.plants || data.results || Object.values(data)[0]);
    } catch (error) {
        console.error('[DeepSeek] Search Error:', error);
        return [];
    }
};

export const getPlantDetails = async (plantName) => {
    if (!API_KEY) return null;

    const prompt = `Act as a botanical expert. Provide detailed specifications for the plant "${plantName}".
Return a JSON object with:
- description: Technical but poetic description in HUD style.
- metadata: { humidity, temperature, light, toxicity }
- image_prompt: Cinematic descriptive prompt for AI image generator to create a cinematic botanical specimen image.
Return ONLY the JSON object.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('[DeepSeek] Details Error:', error);
        return null;
    }
};
