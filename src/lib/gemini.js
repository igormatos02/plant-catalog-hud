import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabaseClient";

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

const searchCache = new Map();

const normalizePlantData = (data, scientificName) => {
    if (!data) return null;
    return {
        ...data,
        scientific_name: data.scientific_name || scientificName,
        popular_name: data.popular_name || data.name || scientificName,
        taxonomy: data.taxonomy || {
            class: data.class || '---',
            order: data.order || '---',
            family: data.family || '---',
            genus: data.genus || '---',
            species: data.species || '---'
        }
    };
};

export const getCompletePlantData = async (scientificName, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    if (!API_KEY) return null;

    const langName = getLanguageName(language);

    // 1. Try to load from Supabase first
    try {
        const { data: cachedData, error: fetchError } = await supabase
            .from('plant_cache')
            .select('data')
            .eq('scientific_name', scientificName)
            .eq('language', language)
            .single();

        if (cachedData && !fetchError) {
            console.log(`[Supabase] Data retrieved from cache for ${scientificName} (${language})`);
            return normalizePlantData(cachedData.data, scientificName);
        }
    } catch (err) {
        console.warn("[Supabase] Cache fetch failed, proceeding to Gemini:", err.message);
    }

    // 2. If not in cache, fetch from Gemini
    const prompt = `Provide a comprehensive technical botanical report for the specimen "${scientificName}".
    Return a SINGLE JSON object with all the following information:
    - name: common name in ${langName}
    - class, order, genus, family, species (taxonomy)
    - description: technical HUD-style summary (${langName})
    - varieties: known sub-species names (${langName})
    - metadata: { humidity, gbifId, temperature, light, toxicity, toxicity_level, size, type, time_to_adult, lifespan }
    - lifecycle: 12 objects (January-December) with fields: month, fructification (0-10), flowering (0-10), foliage (0-10), pruning (0-10), is_rain_season, is_sun_season.
    - botany: { botanical_description, foliage, flower, fruit, seed, root, stem, fragrance, leaves, pollinationType, plantType }
    - culinary: { culinary_use, culinary_leaves, culinary_seeds, culinary_fruits, culinary_stem, part_makes_tea, part_makes_oil }
    - medical: { therapeutic_use, oils_and_florals, tea, perfume, soap, sachets, other_subproducts }
    - cultivation: { cultivation, soil, drainage, propagation, symbiosis, protection, pruning, planting_season }
    
    IMPORTANT: Provide all text content in ${langName}. Use "NOT_APPLICABLE" if information is unknown.
    Output MUST be a valid JSON object only. No preamble or markdown code blocks.`;

    try {
        console.log(`[Gemini] Comprehensive fetch for: ${scientificName} (${langName}) using gemini-flash-latest`);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const fullData = JSON.parse(text);

        // Normalize before returning and saving
        const normalizedData = normalizePlantData(fullData, scientificName);

        // 3. Save to Supabase for future use
        try {
            const { error: insertError } = await supabase
                .from('plant_cache')
                .upsert({
                    scientific_name: scientificName,
                    language: language,
                    data: normalizedData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'scientific_name,language' });

            if (insertError) {
                console.error("[Supabase] Failed to cache data:", insertError.message);
            } else {
                console.log(`[Supabase] Successfully cached data for ${scientificName}`);
            }
        } catch (saveErr) {
            console.warn("[Supabase] Could not save to cache:", saveErr.message);
        }

        return normalizedData;
    } catch (error) {
        console.error(`[Gemini] Comprehensive fetch failed:`, error.message);
        return null;
    }
};

export const searchPlants = async (query, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    if (!API_KEY) {
        console.error("[Gemini] API Key missing. Please set VITE_GEMINI_API_KEY in .env");
        return [];
    }

    const cacheKey = `${query}_${language}`;
    if (searchCache.has(cacheKey)) {
        console.log("[Gemini] Returning memory-cached search results for:", query);
        return searchCache.get(cacheKey);
    }

    // 1. Try to load search results from Supabase cache
    try {
        const { data: cachedSearch, error: fetchError } = await supabase
            .from('search_cache')
            .select('results')
            .eq('query', query.toLowerCase().trim())
            .eq('language', language)
            .single();

        if (cachedSearch && !fetchError) {
            console.log(`[Supabase] Search results retrieved from cache for: ${query} (${language})`);
            searchCache.set(cacheKey, cachedSearch.results);
            return cachedSearch.results;
        }
    } catch (err) {
        console.warn("[Supabase] Search cache fetch failed, proceeding to Gemini:", err.message);
    }

    const langName = getLanguageName(language);
    const prompt = `Return a JSON array of plants related to "${query}". 
    Use ${langName} for all common names and origins.
    Include exactly these fields: "name", "popular_name", "origin", "type", "scientific_name".
    Maximum 6 results. If "${query}" is a specific species, return that as the first result.
    Output MUST be a valid JSON array.`;

    try {
        console.log(`[Gemini] Rapid search for: ${query} (${langName})`);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const results = JSON.parse(text);

        // 2. Save search results to Supabase cache
        try {
            const { error: insertError } = await supabase
                .from('search_cache')
                .upsert({
                    query: query.toLowerCase().trim(),
                    language: language,
                    results: results,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'query,language' });

            if (insertError) {
                console.error("[Supabase] Failed to cache search results:", insertError.message);
            } else {
                console.log(`[Supabase] Successfully cached search results for: ${query}`);
            }
        } catch (saveErr) {
            console.warn("[Supabase] Could not save search results to cache:", saveErr.message);
        }

        searchCache.set(cacheKey, results);
        return results;
    } catch (error) {
        console.error(`[Gemini] Search optimized failure:`, error.message);
        return [];
    }
};

export const getPlantDetails = async (scientificName, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    // Redirect to the comprehensive fetch to benefit from Supabase cache
    return getCompletePlantData(scientificName, language);
};

export const getPlantTabDetails = async (scientificName, tabId, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    // If we call this, we already have complete data most likely, but just in case
    const data = await getCompletePlantData(scientificName, language);
    return data ? data[tabId] || data : null;
};

export const getPlantPdfReportData = async (scientificName, language = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en') => {
    // Benefit from Supabase cache if available
    const completeData = await getCompletePlantData(scientificName, language);
    if (completeData) return completeData;

    // Fallback logic if for some reason we don't want to use getCompletePlantData
    if (!API_KEY) return null;

    const langName = getLanguageName(language);
    const prompt = `Act as a botanical expert. Provide a comprehensive technical report for the plant "${scientificName}".
    IMPORTANT: Provide all text content in ${langName}.
    
    Return a JSON object with:
    - scientific_name: species name.
    - popular_name: common name.
    - description: technical/poetic summary.
    - taxonomy: { class, order, family, genus }
    - metadata: { humidity, temperature, light, toxicity, toxicity_level, gbifId, time_to_adult, lifespan }
    - culinary: { culinary_use, culinary_leaves, culinary_seeds, culinary_fruits, culinary_stem }
    - medical: { therapeutic_use, oils_and_florals, tea, perfume, soap, sachets }
    - cultivation: { cultivation, soil, drainage, propagation, symbiosis, pruning }
    
    Only return the JSON object, no other text.`;

    const modelsToTry = ["gemini-1.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting PDF data with model: ${modelName} in ${langName}`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error(`[Gemini] PDF error with ${modelName}:`, error.message);
        }
    }
    return null;
};
