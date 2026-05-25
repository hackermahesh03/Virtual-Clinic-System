const axios = require("axios");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
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
