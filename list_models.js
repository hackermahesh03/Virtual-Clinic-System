const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(key);
    // There is no direct listModels in the SDK easily shown, so I'll try a very old model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("SUCCESS with gemini-pro:", response.text());
  } catch (err) {
    console.error("FAILED with gemini-pro:", err.message);
    
    // Try one more: gemini-1.0-pro
    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log("SUCCESS with gemini-1.0-pro:", response.text());
    } catch (err2) {
        console.error("FAILED with gemini-1.0-pro:", err2.message);
    }
  }
}
listModels();
