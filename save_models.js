const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await axios.get(url);
    fs.writeFileSync("models.json", JSON.stringify(response.data, null, 2));
    console.log("Models saved to models.json");
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
