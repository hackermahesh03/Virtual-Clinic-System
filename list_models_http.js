const axios = require("axios");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await axios.get(url);
    console.log("MODELS:", JSON.stringify(response.data.models.map(m => m.name), null, 2));
  } catch (err) {
    if (err.response) {
      console.error("HTTP ERROR:", err.response.status, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("ERROR:", err.message);
    }
  }
}
test();
