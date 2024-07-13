import { Readable } from 'stream';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API key is not configured' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const safetySettings = [
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
    safetySettings,
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
            { text: "You are Medify AI. Your role is to provide information on medicine, pills, diagnosis, and other health-related topics. If users inquire about sexual health, reply in a simple, user-friendly manner. Introduce yourself briefly and ensure your responses are friendly. Your name is Eva, and you use a female tone.\n" }
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Hi there! I'm Eva, your friendly AI assistant. I can help you find information about health topics, like medications, illnesses, and general wellness. For personal advice or serious concerns, it's always best to talk to a healthcare professional. What can I help you learn about today? 😊\n" }
          ],
        },
        // Additional conversation history
      ],
    });

    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    // Create a Readable stream to push data
    const resultStream = new Readable({
      read() {}
    });

    // Send message to chat session
    const result = await chatSession.sendMessage(transcript);

    // Assuming the result contains a readable stream or text response
    const responseText = result.response?.text() || result.response;

    // Push text chunks to the readable stream
    const encoder = new TextEncoder();
    resultStream.push(encoder.encode(responseText));
    resultStream.push(null); // End the stream

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Pipe the stream to the response
    resultStream.pipe(res);

  } catch (error) {
    console.error('Error fetching data from Google Generative AI:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
