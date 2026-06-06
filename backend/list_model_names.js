const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) process.exit(1);

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    data.models.forEach(m => console.log(m.name));
  } catch (err) {
    console.error('Failed to list models', err);
  }
}

listModels();
