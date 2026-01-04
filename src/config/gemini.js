// Gemini AI Configuration
// This file sets up Google Gemini 1.5 Pro for the teaching agent

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * PEDAGOGICAL SYSTEM INSTRUCTION
 * This is the core teaching logic that makes Erudite different from a chatbot.
 * Every response MUST follow these rules:
 * 1. Detect and correct misconceptions
 * 2. Teach using analogies and PDF references
 * 3. End with a micro-assessment question
 */
export const TEACHING_SYSTEM_INSTRUCTION = `You are Erudite, an autonomous pedagogical teaching agent created by expert educators.
You are NOT a chatbot. You are a teaching system that follows strict pedagogical principles.

You have been given the complete content of an academic document. Your role is to teach this material effectively to a student.

=== MANDATORY TEACHING PROTOCOL ===

FOR EVERY SINGLE RESPONSE, YOU MUST FOLLOW THESE THREE STEPS IN ORDER:

**STEP 1: MISCONCEPTION DETECTION**
- Carefully analyze the student's question for any false premises or incorrect assumptions
- If the student has a misconception, you MUST correct it BEFORE answering their question
- Use phrases like: "I notice you're assuming X, but actually..." or "Before I answer, let me clarify a common misconception..."
- If no misconception is detected, proceed to Step 2

**STEP 2: CONCEPT-AWARE TEACHING**
Based on the selected difficulty level, explain the concept:

For BEGINNER level:
- Use simple everyday analogies (like comparing electricity to water flow)
- Avoid technical jargon entirely
- Break down complex ideas into tiny steps
- Use phrases like "Think of it like..." or "Imagine if..."

For INTERMEDIATE level:
- Use some technical terminology with explanations
- Make connections between related concepts
- Provide more detailed explanations
- Use phrases like "Building on the basics..." or "This connects to..."

For EXAM-FOCUSED level:
- Emphasize key formulas, definitions, and common exam patterns
- Point out what examiners typically look for
- Highlight frequently tested concepts
- Use phrases like "For exams, remember..." or "This is commonly tested as..."

IMPORTANT: Always ground your explanations in the uploaded document. Reference specific sections, examples, or definitions from the material using quotes when helpful.

**STEP 3: MICRO-ASSESSMENT**
You MUST end EVERY response with exactly ONE short diagnostic question to test understanding.
Format it EXACTLY like this:

🎯 **Quick Check:** [Your question here]

The question should:
- Test the concept you just explained
- Be answerable in 1-2 sentences
- Help identify if the student truly understood

=== FORMATTING RULES ===
- Use markdown for clear formatting
- Use bullet points for lists
- Use **bold** for key terms
- Use code blocks for formulas or technical notation
- Keep explanations focused and not too long

=== PERSONALITY ===
- Be encouraging and patient
- Celebrate when students understand correctly
- Never make students feel stupid for not knowing something
- Use phrases like "Great question!" or "That's a common area of confusion"

Remember: You are an expert teacher, not just an AI. Every response should feel like a thoughtful lesson from a caring instructor.`;

/**
 * Create a new Gemini model instance with the teaching system instruction
 * @param {string} pdfContent - The extracted text from the uploaded PDF
 * @param {string} difficulty - The difficulty level (beginner/intermediate/exam)
 * @param {string} learningState - JSON string of past misconceptions and weak areas
 * @returns {GenerativeModel} - Configured Gemini model
 */
export function createTeachingModel(pdfContent = '', difficulty = 'beginner', learningState = '') {
    // Build the complete system instruction with PDF context
    let fullInstruction = TEACHING_SYSTEM_INSTRUCTION;

    // Add difficulty level context
    fullInstruction += `\n\n=== CURRENT SESSION SETTINGS ===\nDifficulty Level: ${difficulty.toUpperCase()}`;

    // Add PDF content if available
    if (pdfContent) {
        fullInstruction += `\n\n=== UPLOADED DOCUMENT CONTENT ===\nThe following is the complete content of the academic document the student is learning from. Ground all your explanations in this material:\n\n${pdfContent}`;
    }

    // Add learning state if available
    if (learningState) {
        fullInstruction += `\n\n=== STUDENT LEARNING HISTORY ===\nThe following shows the student's past misconceptions and areas of weakness. Pay special attention to these topics:\n\n${learningState}`;
    }

    // Create the model with the system instruction
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: fullInstruction,
    });

    return model;
}

/**
 * Extract concepts and relationships from PDF for concept map
 * @param {string} pdfContent - The extracted PDF text
 * @returns {Promise<Object>} - Object with nodes and edges for concept map
 */
export async function extractConceptMap(pdfContent) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Analyze the following academic content and extract the key concepts and their prerequisite relationships.

Return a JSON object with this exact structure:
{
  "nodes": [
    { "id": "concept1", "label": "Concept Name", "group": "category" }
  ],
  "links": [
    { "source": "prerequisite_concept_id", "target": "dependent_concept_id" }
  ]
}

Rules:
- Extract 8-15 key concepts (not too many, not too few)
- Group similar concepts together
- Links go FROM prerequisites TO concepts that depend on them
- Only include essential relationships

Content to analyze:
${pdfContent.substring(0, 30000)}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { nodes: [], links: [] };
    } catch (error) {
        console.error('Error extracting concept map:', error);
        return { nodes: [], links: [] };
    }
}

/**
 * Generate a personalized study plan based on weak concepts
 * @param {string} pdfContent - The PDF content
 * @param {Array} weakConcepts - List of concepts the student struggles with
 * @returns {Promise<string>} - Markdown study plan
 */
export async function generateStudyPlan(pdfContent, weakConcepts = []) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Based on the following academic content and the student's weak areas, create a personalized study plan.

Student's Weak Areas:
${weakConcepts.length > 0 ? weakConcepts.join('\n- ') : 'No specific weak areas identified yet'}

Academic Content:
${pdfContent.substring(0, 20000)}

Create a study plan with:
1. Priority topics to review (based on weak areas)
2. Suggested study order (prerequisites first)
3. Time estimates for each topic
4. Specific sections from the document to focus on
5. Practice questions for each topic

Format as clear markdown with headers and bullet points.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating study plan:', error);
        return 'Unable to generate study plan. Please try again.';
    }
}

/**
 * Generate a revision sheet based on interactions
 * @param {string} pdfContent - The PDF content
 * @param {Array} weakConcepts - Concepts the student struggled with
 * @returns {Promise<string>} - Markdown revision sheet
 */
export async function generateRevisionSheet(pdfContent, weakConcepts = []) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Create a one-page revision sheet based on this academic content, focusing on the student's weak areas.

Weak Areas:
${weakConcepts.length > 0 ? weakConcepts.join('\n- ') : 'Cover all main concepts'}

Content:
${pdfContent.substring(0, 20000)}

Create a concise revision sheet with:
- Key definitions (1-2 sentences each)
- Important formulas (if applicable)
- Common pitfalls to avoid
- Quick memory aids/mnemonics
- 3-5 quick self-test questions

Keep it SHORT - this should fit on one page when printed.
Format as clean markdown.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating revision sheet:', error);
        return 'Unable to generate revision sheet. Please try again.';
    }
}

export default genAI;
