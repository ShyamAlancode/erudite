// Gemini Service (API-based)
// Manages chat sessions with the teaching agent via backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Chat Session Manager
 * Communicates with the backend API for Erudite teaching responses
 */
class GeminiService {
    constructor() {
        this.pdfContent = '';
        this.difficulty = 'beginner';
        this.conversationHistory = [];
    }

    /**
     * Initialize or reinitialize the chat session with new context
     * @param {string} pdfContent - The extracted PDF text
     * @param {string} difficulty - beginner/intermediate/exam
     * @param {string} learningState - JSON of past misconceptions (unused for now)
     */
    initializeChat(pdfContent = '', difficulty = 'beginner', learningState = '') {
        this.pdfContent = pdfContent;
        this.difficulty = difficulty;
        this.conversationHistory = [];
        return true;
    }

    /**
     * Send a message to Erudite and get a response via backend API
     * @param {string} message - The user's message
     * @returns {Promise<string>} - Erudite's response
     */
    async sendMessage(message) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Call backend API with PDF context
            const response = await fetch(`${API_BASE_URL}/api/chat/context`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context: this.pdfContent,
                    difficulty: this.difficulty
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to get response');
            }

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString()
            });

            return data.reply;
        } catch (error) {
            // Remove failed user message from history
            this.conversationHistory.pop();
            console.error('Error sending message:', error);

            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Is the backend running on port 3001?');
            }

            throw new Error('Failed to get response from Erudite. Please try again.');
        }
    }

    /**
     * Update the difficulty level mid-conversation
     * @param {string} difficulty - New difficulty level
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
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
