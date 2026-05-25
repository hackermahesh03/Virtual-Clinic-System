const axios = require("axios");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Using Key ending in:", key ? key.slice(-4) : "NONE");
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: "Hello" }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("SUCCESS:", response.data.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (err) {
    if (err.response) {
      console.error("HTTP ERROR:", err.response.status, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("ERROR:", err.message);
    }
  }
}
test();
