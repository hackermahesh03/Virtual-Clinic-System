const axios = require("axios");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`;
    const genResponse = await axios.post(
      genUrl,
      { contents: [{ parts: [{ text: "Hello, reply with 'READY' if you are working." }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("RESPONSE:", JSON.stringify(genResponse.data.candidates?.[0]?.content?.parts?.[0]?.text, null, 2));
    console.log("TEST_SUCCESS: true");
  } catch (err) {
    if (err.response) {
      console.error("HTTP ERROR:", err.response.status, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("ERROR:", err.message);
    }
    console.log("TEST_SUCCESS: false");
  }
}
test();
