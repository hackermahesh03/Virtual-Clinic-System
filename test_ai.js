const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Using Key ending in:", key ? key.slice(-4) : "NONE");
  
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test message");
    const response = await result.response;
    console.log("SUCCESS:", response.text());
  } catch (err) {
    console.error("FULL ERROR:", JSON.stringify(err, null, 2));
    console.error("ERROR MESSAGE:", err.message);
  }
}
test();
