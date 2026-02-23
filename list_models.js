import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyD3A1kg6xmGXpASkNI2H6vwdpirm6avkdk';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    console.log("Attempting to list models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("Models List:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
