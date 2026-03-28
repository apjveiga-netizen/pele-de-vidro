import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY not found in .env");
        return;
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    try {
        const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
        for (const m of models) {
            try {
                console.log(`Testing model: ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Respond only with 'OK' if you see this.");
                const text = result.response.text();
                console.log(`Model ${m}: SUCCESS - Response: "${text}"`);
            } catch (e) {
                console.log(`Model ${m}: FAILED - ${e.message}`);
            }
        }
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
