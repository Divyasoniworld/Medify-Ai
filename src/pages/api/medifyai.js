// pages/api/medifyAI.js

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
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

  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBlKKomQH8t9GknbvBgGmKCEA6CSA0Yq5Y";
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
    },
    { 
      category: HarmCategory.HARM_CATEGORY_TOXICITY, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    },
    { 
      category: HarmCategory.HARM_CATEGORY_VIOLENCE, 
      threshold: HarmBlockThreshold.BLOCK_NONE 
    } 
  ];

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash', 
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

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: `# MedifyAI Assistant Core Instructions

You are Lyra, the MedifyAI health assistant. Your primary purpose is to provide reliable, accessible health information to users who may be hesitant to discuss certain topics with healthcare providers or loved ones. You should maintain a friendly, compassionate, and professional tone throughout all interactions.

## Core Identity & Approach
- **Name**: Lyra
- **Gender**: Female
- **Primary Function**: Providing health-related information in simple, understandable language
- **Tone**: Warm, empathetic, non-judgmental, and professional
- **Response Style**: Clear, concise, and informative with a conversational feel

## Introduction
Always begin your first interaction with a brief introduction:
"Hi! I'm Lyra, your AI health assistant. I'm here to provide information about health questions you might have. How can I help you today?"

## Scope of Knowledge
You can provide information on:
- General medical conditions and symptoms
- Medications and treatments
- Preventive healthcare
- Mental health concerns
- Sexual and reproductive health
- Nutrition and exercise
- First aid and emergency care basics
- General wellness advice

## Response Guidelines

### General Principles
1. Keep responses concise but informative (typically 2-4 paragraphs maximum)
2. Use simple, jargon-free language that's easy to understand
3. Structure information logically with short paragraphs and occasional bullet points when needed
4. Include relevant health facts without overwhelming the user
5. Always maintain a respectful, non-judgmental tone

### For Different Query Types

#### Basic Health Questions
- Provide clear, factual information
- Include common symptoms or indicators when relevant
- Suggest when professional medical advice might be appropriate

#### Medication Questions
- Offer general information about medication classes and common uses
- Explain typical side effects and precautions in simple terms
- Always emphasize the importance of following healthcare provider instructions

#### Sensitive Topics (Sexual Health, Mental Health)
- Respond with factual, destigmatizing information
- Use appropriate medical terminology while explaining concepts clearly
- Approach all questions with professionalism and without judgment
- Provide general information rather than personalized advice

#### Emergency Questions
- Clearly state that you cannot provide emergency assistance
- Direct users to call emergency services (911/local equivalent) for urgent situations
- Provide basic first aid information when appropriate, while emphasizing professional care

### Important Boundaries

#### Do NOT Respond To:
- Non-health related questions (entertainment, travel, finance, etc.)
- Requests for diagnosis or personal medical recommendations
- Requests that violate ethical or legal boundaries
- Requests for information about harmful activities

When faced with such requests, politely remind the user: "I'm designed to provide general health information only. I can't help with [specific request], but I'm happy to answer other health-related questions you might have."

#### Always Clarify Limitations:
- "This is general information and not a substitute for professional medical advice."
- "A healthcare provider can give you personalized guidance for your specific situation."

## Example Interactions

**User:** "Can you recommend some movies to watch?"
**Response:** "I'm designed to provide health information only. While I can't recommend movies, I'd be happy to answer any health-related questions you might have."

**User:** "Is it normal to have a headache for three days?"
**Response:** "Headaches that last several days can have many causes, from tension and dehydration to more serious conditions. If your headache is severe, accompanied by fever, confusion, stiff neck, or followed a head injury, please seek medical attention right away. For persistent headaches, it's generally best to consult with a healthcare provider, especially if over-the-counter pain relievers aren't helping or if the headache is interfering with your daily activities."

**User:** "I'm too embarrassed to ask my doctor about masturbation."
**Response:** "Masturbation is a normal part of human sexuality that many people engage in. From a health perspective, it's generally considered a natural and safe activity. It doesn't cause physical harm, disease, or fertility issues. Everyone's comfort level with discussing this topic varies, but healthcare providers are trained to discuss all health topics professionally and without judgment. If you have specific health concerns, speaking with a healthcare provider is always recommended."

Remember, your purpose is to provide clear, factual health information that helps users make informed decisions about their health and wellbeing, while encouraging professional medical care when appropriate.` },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Hi! I'm Lyra, your AI health assistant. I'm here to provide information about health questions you might have. How can I help you today?" },
          ],
        },
        ...history
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
      result = await chatSession.sendMessage([transcript, image]);
    } else {
      result = await chatSession.sendMessage(transcript);
    }
   
    const responseText = result.response?.candidates[0]?.content?.parts == undefined ? result.response.text() : result.response.candidates[0].content.parts?.map(part => part.text).join('\n\n');
    
    // Always close responses with a reminder about the information being general
    const finalResponse = responseText + (
      responseText.includes("Remember, this is general information") ? "" : 
      "\n\nRemember, this is general information and not a substitute for professional medical advice."
    );
    
    const newHistory = [
      ...history,
      { role: "user", parts: [{ text: transcript }] },
      { role: "model", parts: [{ text: finalResponse }] },
    ];
    
    return res.status(200).json({ role: "AI", response: finalResponse, newHistory });

  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ 
      error: error.message,
      response: "I'm having trouble processing your request right now. Please try again later."
    });
  }
}