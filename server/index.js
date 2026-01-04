// =============================================================
// ERUDITE BACKEND SERVER
// Express.js server with Gemini AI integration
// =============================================================

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// =============================================================
// CONFIGURATION
// =============================================================

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate API key exists
if (!GEMINI_API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY is not set in environment variables');
    console.error('   Please add GEMINI_API_KEY=your_key_here to your .env file');
    process.exit(1);
}

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// =============================================================
// SYSTEM PROMPT - Academic Tutor Persona
// =============================================================

const SYSTEM_PROMPT = `You are Aletheia, an expert academic tutor designed to help students learn effectively.

Your teaching style:
- BEGINNER-FRIENDLY: Assume the student is new to the topic
- STEP-BY-STEP: Break down complex concepts into small, digestible steps
- SIMPLE LANGUAGE: Avoid jargon; when technical terms are needed, explain them
- EXAMPLES: Use real-world examples and analogies to illustrate concepts
- ENCOURAGING: Be supportive and patient

Response format:
- Use markdown for formatting (headers, lists, code blocks)
- Keep paragraphs short (2-3 sentences max)
- End with a quick comprehension check when appropriate

Remember: Your goal is to help students truly UNDERSTAND, not just memorize.`;

// =============================================================
// EXPRESS APP SETUP
// =============================================================

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests from any localhost port for development
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(express.json());

// =============================================================
// ROUTES
// =============================================================

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Erudite backend is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Chat endpoint - Main Gemini integration
 * POST /api/chat
 * 
 * Request body: { "message": "user question here" }
 * Response: { "reply": "Gemini response here" }
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message must be a string' });
        }

        // Initialize model with system instruction
        const model = genAI.getGenerativeModel({
            model: 'models/gemini-flash-lite-latest',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Generate content (stateless)
        const result = await model.generateContent(message.trim());
        const reply = result.response.text();

        res.json({
            reply,
            model: 'gemini-flash-lite-latest'
        });

    } catch (error) {
        console.error("❌ Gemini Chat Error FULL:", error);

        res.status(500).json({
            error: "Failed to generate response",
            details: error.message || "Unknown Gemini error"
        });
    }
});

/**
 * Chat with context endpoint - For PDF-based learning
 * POST /api/chat/context
 * 
 * Request body: { "message": "...", "context": "PDF content...", "difficulty": "beginner" }
 */
app.post('/api/chat/context', async (req, res) => {
    try {
        const { message, context, difficulty = 'beginner' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build enhanced system prompt with context
        let enhancedPrompt = SYSTEM_PROMPT;

        if (context) {
            enhancedPrompt += `\n\n=== STUDY MATERIAL ===\nThe student is learning from the following document. Use this as the primary source for your explanations:\n\n${context}`;
        }

        enhancedPrompt += `\n\n=== DIFFICULTY LEVEL: ${difficulty.toUpperCase()} ===`;

        if (difficulty === 'beginner') {
            enhancedPrompt += '\nUse very simple language, lots of analogies, and break everything into tiny steps.';
        } else if (difficulty === 'intermediate') {
            enhancedPrompt += '\nUse some technical terms (with explanations) and make connections between concepts.';
        } else if (difficulty === 'exam') {
            enhancedPrompt += '\nFocus on exam-relevant points, formulas, and common test questions.';
        }

        const model = genAI.getGenerativeModel({
            model: 'models/gemini-flash-lite-latest',
            systemInstruction: enhancedPrompt,
        });

        const result = await model.generateContent(message.trim());
        const reply = result.response.text();

        return res.json({ reply });

    } catch (error) {
        console.error('❌ Context Chat Error:', error.message);
        return res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
});

/**
 * Extract concept map from PDF content
 * POST /api/concept-map
 */
app.post('/api/concept-map', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'PDF content is required' });
        }

        const prompt = `Analyze this academic document and extract the key concepts and their relationships.

Return a JSON object with this exact structure:
{
  "nodes": [
    { "id": "1", "name": "Concept Name", "category": "main|sub|detail" }
  ],
  "links": [
    { "source": "1", "target": "2", "relationship": "requires|leads-to|part-of" }
  ]
}

Rules:
- Extract 5-15 key concepts
- Identify prerequisite relationships (which concepts need to be understood first)
- Use categories: "main" for primary topics, "sub" for subtopics, "detail" for specific facts
- Return ONLY valid JSON, no other text

Document content:
${content.substring(0, 8000)}`;

        const model = genAI.getGenerativeModel({
            model: 'models/gemini-flash-lite-latest',
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Try to parse JSON from response
        let conceptMap;
        try {
            // Extract JSON from response (may be wrapped in markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            conceptMap = jsonMatch ? JSON.parse(jsonMatch[0]) : { nodes: [], links: [] };
        } catch {
            conceptMap = { nodes: [], links: [] };
        }

        return res.json(conceptMap);

    } catch (error) {
        console.error('❌ Concept Map Error:', error.message);
        return res.status(500).json({ error: 'Failed to generate concept map', details: error.message });
    }
});

/**
 * Generate study plan from PDF content
 * POST /api/study-plan
 */
app.post('/api/study-plan', async (req, res) => {
    try {
        const { content, weakConcepts = [] } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'PDF content is required' });
        }

        const prompt = `You are an expert learning strategist. Create a personalized study plan based on this academic document.

${weakConcepts.length > 0 ? `The student has identified these weak areas: ${weakConcepts.join(', ')}` : ''}

Create a comprehensive study plan with:
1. **Learning Objectives** - What the student will master
2. **Prerequisites Check** - Concepts to review first
3. **Study Sessions** - Break down into 30-minute blocks
4. **Key Formulas/Definitions** - Must-know items
5. **Practice Questions** - Self-assessment questions
6. **Review Schedule** - Spaced repetition timeline

Format in clear, readable markdown.

Document content:
${content.substring(0, 8000)}`;

        const model = genAI.getGenerativeModel({
            model: 'models/gemini-flash-lite-latest',
        });

        const result = await model.generateContent(prompt);
        const studyPlan = result.response.text();

        return res.json({ studyPlan });

    } catch (error) {
        console.error('❌ Study Plan Error:', error.message);
        return res.status(500).json({ error: 'Failed to generate study plan', details: error.message });
    }
});

/**
 * Generate revision sheet from PDF content
 * POST /api/revision-sheet
 */
app.post('/api/revision-sheet', async (req, res) => {
    try {
        const { content, weakConcepts = [] } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'PDF content is required' });
        }

        const prompt = `Create a concise one-page revision sheet from this academic document.

${weakConcepts.length > 0 ? `Focus especially on these weak areas: ${weakConcepts.join(', ')}` : ''}

Include:
1. **Key Definitions** (5-10 most important)
2. **Essential Formulas** (if applicable)
3. **Quick Facts** (bullet points)
4. **Common Mistakes to Avoid**
5. **Memory Tricks** (mnemonics if helpful)
6. **5-Question Quick Quiz** (with answers)

Keep it concise - this should fit on one page when printed.
Format in clean markdown.

Document content:
${content.substring(0, 8000)}`;

        const model = genAI.getGenerativeModel({
            model: 'models/gemini-flash-lite-latest',
        });

        const result = await model.generateContent(prompt);
        const revisionSheet = result.response.text();

        return res.json({ revisionSheet });

    } catch (error) {
        console.error('❌ Revision Sheet Error:', error.message);
        return res.status(500).json({ error: 'Failed to generate revision sheet', details: error.message });
    }
});

// =============================================================
// START SERVER
// =============================================================

app.listen(PORT, () => {
    console.log('');
    console.log('🎓 ═══════════════════════════════════════════════════');
    console.log('   ERUDITE BACKEND SERVER');
    console.log('═══════════════════════════════════════════════════');
    console.log(`   ✅ Server running on http://localhost:${PORT}`);
    console.log(`   ✅ Gemini model: gemini-flash-lite-latest`);
    console.log(`   ✅ CORS enabled for localhost`);
    console.log('');
    console.log('   Endpoints:');
    console.log(`   • GET  /api/health         - Health check`);
    console.log(`   • POST /api/chat           - Chat with Aletheia`);
    console.log(`   • POST /api/chat/context   - Chat with PDF context`);
    console.log(`   • POST /api/concept-map    - Extract concept map`);
    console.log(`   • POST /api/study-plan     - Generate study plan`);
    console.log(`   • POST /api/revision-sheet - Generate revision sheet`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

export default app;

