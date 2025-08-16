// pages/api/medifyAI.js
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import axios from "axios";

async function getImageAsBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

export default async function handler(req, res) {

   const cookies = req.headers.cookie
    ? Object.fromEntries(
        req.headers.cookie.split("; ").map(c => {
          const [key, ...v] = c.split("=");
          return [key, decodeURIComponent(v.join("="))];
        })
      )
    : {};

     const language = cookies.lang || "English"; // fallback to English


  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const { transcript, dataimage, history } = req.body;

    /** Safety settings */
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_MEDICAL, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUAL, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DEROGATORY, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_TOXICITY, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_VIOLENCE, threshold: HarmBlockThreshold.BLOCK_NONE }
    ];

    /** Model config */
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    // In pages/api/medifyAI.js

    const lang = language || "English";

    // Wrap systemInstruction with dynamic language instruction
    const systemInstruction = `
You are MedifyAI, a medical information assistant. 
Always respond in **clean, well-formatted Markdown** in ${lang} using the structure below.

## 💊 [Medicine Name] ([Generic Name])

A one-sentence summary of what the medicine is and its main purpose.

### ✅ Primary Uses
- [Use Case 1]
- [Use Case 2]
- [Use Case 3]

### 👉 Dosage & How to Take
- **Adults:** [Dosage instructions]
- **Children:** [Pediatric dosage instructions]
- **Important:** [Critical instruction]
- **With Food?:** [Yes/No]

### ⚠️ Potential Side Effects & Warnings
**Common Side Effects:**
- [Side Effect 1]
- [Side Effect 2]

**Serious Warnings:**
- [Warning 1]
- [Warning 2]

> **🚨 SEEK IMMEDIATE MEDICAL HELP IF YOU EXPERIENCE:**
> - [Symptom 1]
> - [Symptom 2]

### ⚕️ Disclaimer
This information is for **educational purposes only**. Always consult a **qualified healthcare professional** before taking any medicine.
`;

    // Create chat session with history
    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      config: {

        systemInstruction: systemInstruction,
      },
      // history: chatHistory,
      safetySettings,
      generationConfig
    });

    // Prepare message content
    const parts = [{ text: transcript }];

    if (dataimage) {
      const base64Image = await getImageAsBase64(dataimage);
      if (base64Image) {
        parts.push({
          inlineData: { data: base64Image, mimeType: "image/png" }
        });
      }
    }

    // Streaming setup
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const stream = await chat.sendMessageStream({
      message: { role: "user", parts }
    });

    let fullText = "";
    for await (const chunk of stream) {
      if (chunk.text) {
        fullText += chunk.text;
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    // Final send
    res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error.message,
      response: "I'm having trouble processing your request right now. Please try again later."
    });
  }
}
