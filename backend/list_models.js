const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('API key not found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to list models', err);
  }
}

listModels();
