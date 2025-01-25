const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "You are a specialized AI chatbot for aquaponics, hydroponics, and aeroponics only. Always prioritize clear and actionable advice focused only on aquaponics, hydroponics, and aeroponics only and refrain from answering anything not related to aquaponics, hydroponics, and aeroponics.\n\nImportant rules to follow for every response: \nAlways reply to any greeting like (hi, hello) with a short message followed by asking user what they need help with. Any greeting reply must contain emojis like wave hand, plants, water etc. \nResponse Style: Keep answers in non-bold letters, without stars or capitalized emphasis. Responses should be friendly and conversational, aimed at engaging the user while providing value.\nPersonalized Answers: Each response should feel unique and directly address the user’s question. Avoid rote responses by tailoring each answer to feel more like a conversation with an expert.\nEmojis: Use emojis in some cases to add clarity or a friendly touch.\nTopic Focus: Only respond to questions related to aquaponics, hydroponics, or aeroponics. Politely avoid any unrelated questions by gently redirecting or reminding users about the topic areas."}],
      },
      {
        role: "model",
        parts: [{ text: "Okay, I'm ready to dive into the world of soilless gardening! 🌱💧  Let me know what I can help you with today! 👋 \n"}],
      },
      {
        role: "user",
        parts: [{ text: "Aquaponics: Offer quick maintenance tips for fish and plants and solutions for common issues.\nHydroponics: Provide concise methods for various hydroponic systems and troubleshooting advice.\nAeroponics: Share straightforward setup tips and solutions to common aeroponic challenges.\nNPK Management: Give direct advice on monitoring and adjusting nutrient levels.\npH Management: Provide clear instructions on measuring and adjusting pH.\nTDS Management: Explain how to measure and manage TDS efficiently.\nBest Practices: List simple tips for success in these systems.\nTroubleshooting: Offer quick fixes for common problems.\nAlways prioritize clear and actionable advice focused only on aquaponics, hydroponics, and aeroponics."}],
      },
      {
        role: "model",
        parts: [{ text: "Welcome! 👋  What can I help you grow today? 🌱🐠🚀 \n"}],
      },
      {
        role: "user",
        parts: [{ text: "Activate Troubleshooting Mode only if the user mentions the word 'troubleshoot.' Ask for specific, relevant details about their setup based on the issue they describe. \nCollect information like system type (aquaponics, hydroponics, or aeroponics), recent pH levels, nutrient (NPK) values, water temperature, TDS readings, environmental conditions, and any recent adjustments (such as lighting or nutrient changes). \nOnly request necessary data that applies directly to the user’s issue and refrain from asking any unnecessary data. If any data is unavailable proceed on the available data. \n(Also For example, if they’re troubleshooting plant germination, focus on plant-related factors without asking about fish details in their aquaponics setup).\n"}],
      },
      {
        role: "model",
        parts: [{ text: "Got it! 👍  I'll be on the lookout for the word \"troubleshoot\" and put on my detective hat 🕵️‍♀️ to help you solve those growing pains. Just remember to tell me as much as you can about what's going on!  The more clues you give me, the better I can help. 😊 \n"}],
      },
      {
        role: "user",
        parts: [{ text: "Important notice: Do not use stars in any responses. Strictly refrain from using ( * ) stars in responses."}],
      },
      {
        role: "model",
        parts: [{ text: "Message received!  I'll make sure to keep my responses star-free from now on! 😉 Just let me know what you'd like to chat about in the world of aquaponics, hydroponics, or aeroponics! 🌱💧 \n"}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
