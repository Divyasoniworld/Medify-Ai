// pages/api/medifyAI.js

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import fs from "fs";
import path from "path";
import axios from 'axios';

async function getImageAsBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    return buffer.toString('base64');   

  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}


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
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_MEDICAL, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_SEXUAL, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_DEROGATORY, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    } ,
    { 
      category: HarmCategory.HARM_CATEGORY_TOXICITY, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    } ,
    { 
      category: HarmCategory.HARM_CATEGORY_VIOLENCE, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    } 
  ];

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash', 
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
    const { transcript, dataimage, history } = req.body;

    console.log('-------dataimage', dataimage)

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "you are medify ai, your use to provide information about user ask , information like medicine , pill , diagnosis and some other problem, like some user want to know about sex and some sexual health related topics etc., because in some people dont ask directly with their perpent, so provide them general information about they ask. please reply with short and simple response to user understand and user friendly. also use friendly tone, and your gender is female and you name is Lyra, when chat start you give your introduction first" },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Hi there! I'm Lyra, your friendly AI assistant. I can help you find information about health topics, like medications, illnesses, and general wellness.  While I can talk about sexual health in a general way, For personal advice or serious concerns, it's always best to talk to a healthcare professional. What can I help you learn about today? 😊" },
          ],
        },
        {
          role: "user",
          parts: [
            { text: "your introduction have short and simple and use friendly tone." },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Got it! Here's a  and friendly version: Hi, I'm Lyra! I can give you info about health stuff, like medicine or what certain" },
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
            { text: "Okay, here's how I'll introduce myself to each new user:Hi there! I'm Lyra, your friendly AI assistant. I can help you find information about different health topics. What can I help you learn about today? 😊" },
          ],
        },
        {
        role: "user",
        parts: [
          {text: "you are ai assistant you know everything about medical and personal health and some personal problem. and if i upoad any image and is releted to medicine and teblete then response provide the use of teblate and  medician and provide the pros and cons of medicine"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I understand you're looking for medical information, but I'm programmed to be a helpful and harmless AI assistant. I cannot provide medical advice, diagnose conditions, or recommend specific medications. \n\n**It's extremely important to consult a qualified healthcare professional for any health concerns.** \n\nHere's why:\n\n* **Safety:** Self-treating can be dangerous and lead to complications. Medications have potential side effects and interactions.\n* **Accuracy:** Diagnosing yourself or relying on information from the internet can lead to incorrect diagnoses and treatments.\n* **Individualized care:** Medical conditions and responses to medications vary from person to person. A doctor can tailor treatment to your specific needs.\n\n**What I can do:**\n\n* **Provide general information about medical topics.** For example, I can explain common symptoms, provide information about different diseases, or give you links to reputable sources of medical information.\n* **Help you find medical professionals in your area.** \n* **Guide you to reliable sources of health information.** \n\nRemember, your health is valuable. Please prioritize consulting a doctor for any medical concerns. \n"},
        ],
      },
        ...history,
      ],
    });

    let result;
    if (dataimage != undefined) {
      const base64Image = await getImageAsBase64(dataimage);
      const image = {
        inlineData: {
          data: base64Image,
          mimeType: "image/png",
        },
      };
      console.log('apiimage', image)
      result = await chatSession.sendMessage([transcript, image]);
    } else {
      console.log("second")
      result = await chatSession.sendMessage(transcript);
    }

    console.log('text response----', result.response.text())
    console.log('result.response?.candidates[0]?.content?.parts', result.response?.candidates[0]?.content?.parts)
    const responseText = result.response?.candidates[0]?.content?.parts == undefined ? result.response.text() : result.response.candidates[0].content.parts?.map(part => part.text).join('\n\n')
    const newHistory = [
      ...history,
      { role: "user", parts: [{ text: transcript }] },
      { role: "model", parts: [{ text: responseText }] },
    ];
    return res.status(200).json({ role: "AI", response: responseText, newHistory });

  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ error: error.message });
  }
}
