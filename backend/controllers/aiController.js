const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

exports.generateContent = async (req, res) => {
  try {
    const {
      incident_type,
      district,
      location,
      officer_name,
      incident_details,
      key_facts,
      date,
      language_instruction,
      tone,
      sensitivity,
      platforms
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured in backend.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-1.5-pro for complex structured generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1beta" });

    const prompt = `
You are UP Police official media officer. Generate content.

INCIDENT:
- Type: ${incident_type}
- District: ${district}
- Location: ${location}
- Officer: ${officer_name}
- Details: ${incident_details}
- Key Facts: ${key_facts}
- Date: ${date}

LANGUAGE: ${language_instruction}
  - Hindi only → "Sab content Hindi mein likhein."
  - English only → "All content in English."
  - Both → "Press release dono mein, baki Hindi mein."

TONE: ${tone}
  - official → "Formal, authoritative, third-person."
  - alert → "Urgent public warning tone."
  - awareness → "Educational public awareness."
  - achievement → "Celebratory, highlighting police success."

SENSITIVITY RULE: ${sensitivity}
  - high → "Victim/accused names, FIR numbers, addresses ko [REDACTED] se replace karo."
  - medium → "Victim names aur minor details redact karo."
  - low → "Sab public-safe info include karo."

PLATFORMS NEEDED: ${platforms.join(', ')}

Return ONLY a JSON response in the following format (omit keys for platforms not requested):
{
  "press_release": "Formal 3-4 paragraph press release with subject line and date",
  "whatsapp": "Max 320 chars, bold with *asterisks*, emoji allowed",
  "facebook": "Max 500 chars, 3 hashtags at end",
  "twitter": "STRICTLY under 255 chars, 2 hashtags",
  "sms": "Max 155 chars, plain text only, no emoji",
  "redacted": true or false
}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    res.status(200).json({ success: true, data: parsedData });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate content' });
  }
};
