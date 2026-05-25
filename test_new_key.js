const axios = require("axios");
require("dotenv").config();

async function test() {
  const key = "AIzaSyAFisyGv7k81mEglCje1jH3WDD8HkaXlCA";
  try {
    // 1. Check models list
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const listResponse = await axios.get(listUrl);
    console.log("MODELS:", listResponse.data.models.map(m => m.name).slice(0, 5));

    // 2. Test generation with gemini-2.0-flash (or 1.5 if available)
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const genResponse = await axios.post(
      genUrl,
      { contents: [{ parts: [{ text: "Hello" }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("TEST SUCCESS:", genResponse.data.candidates?.[0]?.content?.parts?.[0]?.text);
    console.log("KEY_IS_VALID: true");
  } catch (err) {
    if (err.response) {
      console.error("HTTP ERROR:", err.response.status, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("ERROR:", err.message);
    }
    console.log("KEY_IS_VALID: false");
  }
}
test();
