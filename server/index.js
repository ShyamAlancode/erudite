// =============================================================
// ERUDITE BACKEND SERVER
// Express.js server with Gemini AI integration (NEW SDK)
// =============================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// =============================================================
// CONFIGURATION
// =============================================================

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate API key
if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

// Initialize Gemini client (NEW SDK)
const client = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =============================================================
// SYSTEM PROMPT
// =============================================================

const SYSTEM_PROMPT = `You are Aletheia, an expert academic tutor.

Teaching style:
- Beginner-friendly
- Step-by-step explanations
- Simple language
- Examples and analogies
- Encouraging tone

Format:
- Use markdown
- Short paragraphs
- End with a quick check question when useful.`;

// =============================================================
// EXPRESS APP SETUP
// =============================================================

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST"],
}));

app.use(express.json());

// =============================================================
// ROUTES
// =============================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Erudite backend is running",
    timestamp: new Date().toISOString(),
  });
});

// ---------------- CHAT ----------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a string" });
    }

    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: message.trim(),
      systemInstruction: SYSTEM_PROMPT,
    });

    res.json({
      reply: response.text,
      model: "gemini-flash-lite-latest",
    });

  } catch (error) {
    console.error("❌ Chat Error:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// ---------------- CHAT WITH CONTEXT ----------------

app.post("/api/chat/context", async (req, res) => {
  try {
    const { message, context, difficulty = "beginner" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    let prompt = SYSTEM_PROMPT;

    if (context) {
      prompt += `\n\nSTUDY MATERIAL:\n${context.substring(0, 8000)}`;
    }

    prompt += `\n\nDIFFICULTY: ${difficulty}`;

    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: message.trim(),
      systemInstruction: prompt,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("❌ Context Chat Error:", error.message);
    res.status(500).json({ error: "Context chat failed" });
  }
});

// ---------------- CONCEPT MAP ----------------

app.post("/api/concept-map", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const prompt = `
Extract key concepts and relationships.
Return ONLY valid JSON.

Document:
${content.substring(0, 8000)}
`;

    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: prompt,
    });

    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { nodes: [], links: [] };

    res.json(data);

  } catch (error) {
    console.error("❌ Concept Map Error:", error.message);
    res.status(500).json({ error: "Concept map failed" });
  }
});

// ---------------- STUDY PLAN ----------------

app.post("/api/study-plan", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: `Create a study plan:\n${content.substring(0, 8000)}`,
    });

    res.json({ studyPlan: response.text });

  } catch (error) {
    console.error("❌ Study Plan Error:", error.message);
    res.status(500).json({ error: "Study plan failed" });
  }
});

// ---------------- REVISION SHEET ----------------

app.post("/api/revision-sheet", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: `Create a revision sheet:\n${content.substring(0, 8000)}`,
    });

    res.json({ revisionSheet: response.text });

  } catch (error) {
    console.error("❌ Revision Sheet Error:", error.message);
    res.status(500).json({ error: "Revision sheet failed" });
  }
});

// =============================================================
// START SERVER
// =============================================================

app.listen(PORT, () => {
  console.log("🎓 ERUDITE BACKEND RUNNING");
  console.log(`🚀 Port: ${PORT}`);
  console.log("🤖 Gemini: gemini-flash-lite-latest");
});

export default app;
