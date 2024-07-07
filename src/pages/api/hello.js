/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("image_food5.jpeg", "image/jpeg"),
  ];

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "Welcome to Medify, your personal AI assistant for comprehensive medical knowledge. I'm here to help you with information about various medicines, their uses, side effects, and interactions, as well as insights into a wide range of diseases and conditions. Whether you're looking for guidance on a specific medication, understanding symptoms, or managing a health condition, Medify provides accurate and up-to-date information. How can I assist you today?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "This is a great start!  I can definitely see you being a helpful AI assistant for medical information. Here are a few suggestions to enhance your introduction:\n\n**1. Emphasize Safety and Disclaimer:**\n\n* **Important Note:** While I can provide medical information, I am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.\n\n**2.  Highlight Specific Capabilities:**\n\n*  Instead of just saying \"information,\" be more specific:\n    * **Drug information:** Brand and generic names, dosages, potential side effects, interactions with other medications and foods.\n    * **Disease and condition information:** Symptoms, causes, risk factors, diagnosis, treatment options.\n    * **Latest medical news and research.**\n    * **Help with understanding medical terminology.**\n\n**3.  Make it Conversational:**\n\n*  \"I'm Medify, your personal AI assistant for all things health-related!  Need to know more about a medicine, understand a condition, or just curious about the latest medical news?  Ask me anything!\"\n\n**Here's an example incorporating these suggestions:**\n\n\"Hi there! I'm Medify, your personal AI assistant for all things health-related! Need to know more about a medicine, understand a condition, or just curious about the latest medical news? Ask me anything! I can provide you with information on:\n\n* **Drug information:** Brand and generic names, dosages, potential side effects, interactions.\n* **Disease and condition information:** Symptoms, causes, risk factors, diagnosis, treatment options. \n* **Latest medical news and research.**\n* **Help with understanding medical terminology.**\n\n**Important Note:** While I can provide medical information, I am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment. \n\nHow can I help you today?\" \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Welcome to Medify, your go-to web app for learning about medicines, pills, and general health knowledge! Medify provides general information about medicines and their usage, helping you understand the essentials without offering medical advice. Simply upload an image of any medicine, and we’ll give you all the necessary information in a user-friendly format. Our goal is to support those who may not have in-depth knowledge about the medicines in their home. Let Medify be your guide to better understanding your health and medicines!"},
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "This sounds like a useful and accessible concept for a web app! Focusing on visual identification of medications through image uploads is a great way to make it easy for users to find information quickly.  \n\nHere are some thoughts and suggestions to strengthen Medify's introduction:\n\n**Strengths:**\n\n* **Clear Value Proposition:** You clearly state what Medify does (provides information about medicines) and who it's for (those without in-depth knowledge). \n* **User-Friendly Approach:** Highlighting image upload as the primary method makes it simple and intuitive.\n* **Focus on Understanding:**  Emphasizing that Medify helps users \"understand the essentials\" sets realistic expectations.\n\n**Suggestions for Improvement:**\n\n* **Disclaimer:**  Make the disclaimer about not providing medical advice more prominent.  Consider bolding it or placing it in a separate paragraph at the beginning.\n* **Data Privacy & Security:**  Reassure users about the security and privacy of their uploaded images. Briefly mention how the images are processed and stored.\n* **Information Sources:**  Mention the reputable sources used to compile medication information (e.g., drug databases, pharmaceutical information).\n* **Accuracy and Verification:**  While focusing on user-friendliness, emphasize that users should always consult a healthcare professional for accurate dosage information and medical advice. \n* **Call to Action:**  Encourage users to try it out with a clear call to action like: \"Upload a picture of your medicine now and start learning!\"\n\n**Revised Introduction Example:**\n\n**Welcome to Medify - Your Personal Medicine Guide**\n\nMedify is your go-to web app for easily learning about medicines and pills. **Please remember that Medify is not a substitute for professional medical advice. Always consult with your doctor or pharmacist for personalized guidance.**\n\nSimply upload an image of any medicine, and we'll provide you with essential information in a user-friendly format. We use trusted sources like [mention sources] to ensure accuracy. \n\nOur goal is to empower individuals who may not have in-depth pharmaceutical knowledge to better understand their health and medicines. **Upload a picture of your medicine now and start learning!**\n\nBy incorporating these suggestions, you can make Medify's introduction even more effective and trustworthy! \n"},
          {text: "This is a picture of baked feta pasta, a delicious dish, but not something Medify can help with! It looks like you're trying to upload a food image instead of a medicine. 😉\n\nRemember, Medify specializes in identifying pills and medicines. To get the information you need, try uploading a clear picture of your medicine packaging or the pill itself.  \n\nIf you'd like a recipe for this tempting baked feta dish, I'd be happy to find one for you! 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "in medify i dont use any resourses like any database i use gemini ai model \n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "That's fascinating! Using a powerful AI model like Gemini to interpret images and provide information about medicines is a novel and potentially very effective approach. \n\nHere's how you can incorporate this information into Medify's introduction to highlight this unique feature:\n\n**Example Introduction:**\n\n**Welcome to Medify - Your AI-Powered Medicine Guide**\n\nMedify is a cutting-edge web app that uses the power of artificial intelligence to help you understand your medicines.  **Please remember that Medify is not a substitute for professional medical advice. Always consult with your doctor or pharmacist for personalized guidance.**\n\nHere's how it works:\n\n1. **Snap a Picture:** Take a clear photo of your medicine or its packaging.\n2. **Let Gemini Do the Work:**  Our advanced AI, powered by the Gemini model, analyzes the image to identify the medication.\n3. **Get Essential Information:**  Medify provides you with key details about the medicine in a clear and understandable way.\n\nNo need to search through databases or struggle with complex medical terms!  Medify makes understanding your medications simple and accessible. **Upload a picture now and experience the future of medicine information!**\n\n**Additional Points to Emphasize:**\n\n* **Gemini's Capabilities:**  If appropriate, you could briefly mention the specific capabilities of the Gemini model that make it suitable for this task (e.g., image recognition, text extraction, knowledge representation).\n* **Transparency and Accuracy:**  While using an AI model is a compelling feature, address how you ensure the accuracy and reliability of the information provided, given that Gemini is still under development. \n* **User Feedback:**  As Medify relies on an AI model, encourage users to provide feedback on their experience. This will help you continuously improve accuracy and user experience.\n\nBy highlighting Medify's use of Gemini, you create a compelling narrative about your app's innovative technology and its potential to revolutionize how people access medicine information. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "when first time user interact with our web app provide short and sweet introduction about medify ai assistance\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Here are a few short and sweet introductions for first-time Medify users, emphasizing your use of AI:\n\n**Option 1:  (Focus on Simplicity)**\n\n> \"Hi there! I'm Medify, your AI medicine assistant.  Snap a picture of your medicine and I'll help you understand what it's for.\" \n\n**Option 2: (Highlighting Innovation)**\n\n> \"Welcome to Medify! We use advanced AI to make learning about your medicines easy. Upload a photo and see how it works!\"\n\n**Option 3:  (Emphasizing User-Friendliness)**\n\n> \"New to Medify? It's easy! Just take a picture of your medication and we'll give you the essential information in seconds.\"\n\n**Key Considerations:**\n\n* **Keep it Concise:** First impressions matter!  Use clear and simple language to avoid overwhelming new users.\n* **Create Intrigue:**  Spark curiosity and encourage them to try out the app.\n* **Reinforce the Value Proposition:**  Quickly communicate the core benefit of using Medify - easy access to medicine information. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "its not only take image and uload it , its able to chat with user an guid them to\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Great point! Here are some options that incorporate both the visual and chat-based guidance features:\n\n**Option 1: (Emphasis on Assistance)**\n\n> \"Hi, I'm Medify, your AI medicine guide! Snap a pic of your meds or chat with me directly, I'm here to help you understand them better.\"\n\n**Option 2:  (Focus on Versatility)**\n\n> \"Welcome to Medify! Upload a medicine photo or type your question – we use AI to provide the information you need, your way.\"\n\n**Option 3: (Highlighting Two-Way Interaction)**\n\n> \"New to Medify?  We make learning about medications easy. Chat with me or simply snap a picture, and I'll guide you.\"\n\nThese introductions emphasize the dual functionality of Medify, assuring users that they have multiple ways to interact with the app based on their preference. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "option 1\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Excellent choice!  \n\n**\"Hi, I'm Medify, your AI"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "i chouse option 1 for user know about my web app\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "You've made a great choice! \n\n\"Hi, I'm Med"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "i choose this reply \n\"Hi, I'm Medify, your AI medicine guide! Snap a pic of your meds or chat with me directly, I'm here to help you understand them better.\""},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "That's a fantastic option! It's concise, friendly, and clearly conveys the two main ways users can interact with Medify. It's sure to create a good first impression! 👍 \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();