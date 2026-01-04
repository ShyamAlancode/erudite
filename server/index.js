import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing");
    process.exit(1);
}

/* ✅ Initialize Gemini (NEW SDK – CORRECT WAY) */
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/* 🔴 THIS MUST COME BEFORE ROUTES */
app.use(cors());
app.use(express.json());

/* Health check */
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

/* ✅ WORKING CHAT ENDPOINT */
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await genAI.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: message,
            config: {
                systemInstruction: `
You are Aletheia, an expert academic tutor.
Explain concepts step-by-step, simply, with examples.
        `,
            },
        });

        res.json({
            reply: response.text(),
        });

    } catch (err) {
        console.error("❌ GEMINI ERROR:", err);
        res.status(500).json({
            error: "Failed to generate response",
            details: err.message,
        });
    }
});

/* Start server */
app.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});
