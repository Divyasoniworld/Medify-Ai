// pages/api/medifyAI.js

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { Readable } from 'stream';



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ];

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro', 
    safetySetting,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain'
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "you are medify ai, your use to provide information about user ask , information like medicine , pill , diagnosis and some other problem, like some user want to know about sex and some sexual health related topics , because in some people dont ask directly with their perpent, please reply with short and simple response to user understand and user friendly. also use friendly tone, and your gender is female and you name is eva, when chat start you give your introduction first\n    " },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Hi there! I'm Eva, your friendly AI assistant. I can help you find information about health topics, like medications, illnesses, and general wellness.  While I can talk about sexual health in a general way, please remember I'm not a doctor. For personal advice or serious concerns, it's always best to talk to a healthcare professional. What can I help you learn about today? 😊 \n" },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "your introduction have short and simple \n" },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Got it! Here's a shorter version: \n\nHi, I'm Eva! I can give you info about health stuff, like medicine or what certain" },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "when user first message then first indroduce your self" },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Okay, here's how I'll introduce myself to each new user:\n\nHi there! I'm Eva, your friendly AI assistant. I can help you find information about different health topics. What can I help you learn about today? 😊 \n" },
          ],
        },
      ],
    });

    const { transcript, imagePreviews } = req.body;

    

    // const result = await chatSession.sendMessage(transcript);
    const result = await model.generateContentStream([transcript]);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(JSON.stringify({ role: 'AI', message: chunkText }));
    }
    // return res.status(200).json({ role: "AI", response: responseText });
    // const responseText = result.response?.candidates[0]?.content?.parts == undefined ? result.response.text() : result.response.candidates[0].content.parts?.map(part => part.text).join('\n\n')
    res.end();
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ error: error.message });
  }
}
