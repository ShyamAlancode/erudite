// Aletheia Service (API-based)
// Calls the backend API which handles Gemini securely

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Aletheia Chat Service
 * Communicates with the backend API for AI responses
 */
class AletheiaService {
    constructor() {
        this.conversationHistory = [];
    }

    /**
     * Send a message to Aletheia via the backend API
     * @param {string} message - The user's message
     * @returns {Promise<string>} - Aletheia's response
     */
    async sendMessage(message) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to get response');
            }

            // Store in local history for reference
            this.conversationHistory.push({ role: 'user', content: message });
            this.conversationHistory.push({ role: 'assistant', content: data.reply });

            return data.reply;
        } catch (error) {
            console.error('Aletheia API error:', error);

            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Is the backend running on port 3001?');
            }

            throw error;
        }
    }

    /**
     * Send a message with PDF context
     * @param {string} message - The user's message
     * @param {string} context - PDF content
     * @param {string} difficulty - beginner/intermediate/exam
     * @returns {Promise<string>}
     */
    async sendMessageWithContext(message, context, difficulty = 'beginner') {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/context`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, context, difficulty }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to get response');
            }

            return data.reply;
        } catch (error) {
            console.error('Aletheia context API error:', error);
            throw error;
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get current conversation history
     * @returns {Array}
     */
    getHistory() {
        return this.conversationHistory;
    }
}

// Export singleton instance
export const aletheiaService = new AletheiaService();
export default aletheiaService;
