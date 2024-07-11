// pages/api/medifyAI.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "i create medify ai assistance for provide details about medicines, pills and diagnosis provide accurate information. it also provide information throat image and text provide by user. when user first come and start chat then first provide intro about you. use friendly tone."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here's how you can introduce your Medify AI assistant:\n\n## Medify AI: Your Friendly Health Assistant \n\n👋 Hi there! I'm Medify, your personal AI assistant for all things health-related.  \n\n💊 Need information about a medicine? Just tell me the name and I can provide details on dosage, side effects, interactions, and more. \n\n🔍 Curious about a medical condition?  I can explain symptoms, potential causes, and treatment options.\n\n📸 Have a sore throat? You can even show me a picture and describe your symptoms, and I'll do my best to provide helpful information. \n\nRemember, I am not a doctor and can't offer medical advice.  Always consult with a healthcare professional for any health concerns. \n\nLet's get started! How can I help you today? 😊 \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "your intro is short and sweet and use friendly tone\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "😊 You got it! How about this:\n\n---\n\n👋 Hey there! I'm Medify, your friendly neighborhood AI here to help you make sense of all things health. 💊 Got a question about a medication? Curious about a diagnosis? 🤔 Just ask away! I can give you the lowdown on pills, conditions, and even take a peek at that sore throat picture you've got. 📸\n\nJust remember, I'm your trusty sidekick, not a doctor! Always chat with a healthcare professional for personalized advice.  \n\nReady to dive in? 😊 \n---\n\nThis version emphasizes the friendly and approachable nature of the AI while keeping things concise and engaging. 👍 \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "when user sent first message so please provide introduction about you"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here are a few ways to introduce Medify AI when a user first initiates a chat:\n\n**Option 1:  Friendly and Proactive**\n\n> Hey there! 👋 I'm Medify, your friendly AI assistant for all things health.  What health question can I help you with today? 😊 \n\n**Option 2:  Welcoming and Clear**\n\n> Hi! 😊 You've reached Medify, an AI designed to provide information about medicines, conditions, and more. How can I help you?\n\n**Option 3:  Enthusiastic and Helpful** \n\n> Hello! 👋  Ready to explore the world of health information?  I'm Medify, and I'm here to answer your questions about medications, diagnoses, and even analyze your throat pics! What can I do for you today? \n\n**Remember!**\n\nAfter the initial greeting, it's essential to include these points:\n\n* **Disclaimer:** \"I am not a doctor and cannot provide medical advice. Always consult a healthcare professional for any health concerns.\"\n* **Capabilities:** Briefly mention what Medify can do (e.g., provide information on medicines, analyze throat images, explain medical conditions). \n\nLet me know if you'd like to brainstorm more options! \n"},
          ],
        }
      ],      
    });

    const { transcript,imagePreviews } = req.body;
    console.log('input', transcript)
    const result = await chatSession.sendMessage(transcript);
    console.log('result',  result.response)
    const responseText = result.response?.candidates[0]?.content?.parts == undefined ? result.response.text() :result.response.candidates[0].content.parts?.map(part => part.text).join('\n\n')
    console.log('responseText', responseText)
    return res.status(200).json({ role:"AI", response:responseText });
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ error: error.message });
  }
}
