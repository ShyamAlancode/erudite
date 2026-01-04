// Gemini Service
// Manages chat sessions with the teaching agent

import { createTeachingModel } from '../config/gemini';

/**
 * Chat Session Manager
 * Maintains conversation history and provides methods for interacting with Erudite
 */
class GeminiService {
    constructor() {
        this.chat = null;
        this.model = null;
        this.pdfContent = '';
        this.difficulty = 'beginner';
        this.conversationHistory = [];
    }

    /**
     * Initialize or reinitialize the chat session with new context
     * @param {string} pdfContent - The extracted PDF text
     * @param {string} difficulty - beginner/intermediate/exam
     * @param {string} learningState - JSON of past misconceptions
     */
    initializeChat(pdfContent = '', difficulty = 'beginner', learningState = '') {
        this.pdfContent = pdfContent;
        this.difficulty = difficulty;

        // Create the model with full context
        this.model = createTeachingModel(pdfContent, difficulty, learningState);

        // Start a new chat session
        this.chat = this.model.startChat({
            history: this.conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        });

        return true;
    }

    /**
     * Send a message to Erudite and get a response
     * @param {string} message - The user's message
     * @returns {Promise<string>} - Erudite's response
     */
    async sendMessage(message) {
        if (!this.chat) {
            // Initialize with default settings if not already initialized
            this.initializeChat(this.pdfContent, this.difficulty, '');
        }

        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Send message and get response
            const result = await this.chat.sendMessage(message);
            const response = result.response.text();

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to get response from Erudite. Please try again.');
        }
    }

    /**
     * Update the difficulty level mid-conversation
     * @param {string} difficulty - New difficulty level
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        // Reinitialize with new difficulty (keeps conversation history)
        this.initializeChat(this.pdfContent, difficulty, '');
    }

    /**
     * Get the current conversation history
     * @returns {Array} - Array of message objects
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Clear the conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        if (this.model) {
            this.chat = this.model.startChat({ history: [] });
        }
    }

    /**
     * Check if a PDF is loaded
     * @returns {boolean}
     */
    hasPDFContext() {
        return this.pdfContent.length > 0;
    }
}

// Export a singleton instance
export const geminiService = new GeminiService();
export default geminiService;
