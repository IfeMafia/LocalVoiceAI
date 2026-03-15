require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ ERROR: GEMINI_API_KEY not found.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Direct fetch to list models via API as the SDK listModels is sometimes buggy in older node versions
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        console.log("✅ Connection Successful!");
        console.log("Available Models:");
        data.models.forEach(m => {
            console.log(`- ${m.name}`);
        });


    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
}

listModels();
