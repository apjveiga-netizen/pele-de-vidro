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
        // There isn't a direct listModels in the JS SDK? 
        // Let's try to just test a few variations.
        const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`Model ${m}: SUCCESS`);
            } catch (e) {
                console.log(`Model ${m}: FAILED - ${e.message}`);
            }
        }
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
