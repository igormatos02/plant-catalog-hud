import OpenAI from 'openai';

const API_KEY = 'sk-6b74735b9d9d46f2a485e48c7ceec5b8';

const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true // Essential for client-side use in Vite
});

export const searchPlants = async (query) => {
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
        // DeepSeek might return a wrapped object if asked for an array in json_object mode
        // We'll parse and handle if it's an array directly or inside a key
        const data = JSON.parse(content);
        return Array.isArray(data) ? data : (data.plants || data.results || Object.values(data)[0]);
    } catch (error) {
        console.error('[DeepSeek] Search Error:', error);
        return [];
    }
};

export const getPlantDetails = async (plantName) => {
    const prompt = `Act as a botanical expert. Provide detailed specifications for the plant "${plantName}".
Return a JSON object with:
- description: Technical but poetic description in HUD style.
- metadata: { humidity, temperature, light, toxicity }
- image_prompt: Cinematic descriptive prompt for AI image generation.
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
