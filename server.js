import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const response = await client.models.generateContent({
      model: "models/gemini-flash-lite-latest",
      contents: req.body.message,
      systemInstruction: `
You are an academic tutor.
Explain concepts step by step.
Use simple language and examples.
      `,
    });
    res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running"));
