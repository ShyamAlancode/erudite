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
        if (!req.body) {
            return res.status(400).json({
                error: "Request body missing",
                hint: "Did you send Content-Type: application/json ?"
            });
        }

        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Invalid message",
                details: "message must be a non-empty string"
            });
        }

        const response = await genAI.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: message,
        });

        res.json({
            reply: response.text(),
        });

    } catch (err) {
        console.error("❌ Chat Error:", err);

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
