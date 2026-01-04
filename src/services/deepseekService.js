// DeepSeek AI Service
// Handles chat interactions with DeepSeek AI using OpenAI-compatible API

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * DeepSeek Chat Service
 * Manages conversation with DeepSeek AI
 */
class DeepSeekService {
    constructor() {
        this.conversationHistory = [];
        this.systemPrompt = `You are a helpful, intelligent AI assistant. You provide clear, accurate, and helpful responses to user questions. You are knowledgeable across many topics and can help with:

- Answering questions on any topic
- Explaining complex concepts simply
- Helping with problem-solving
- Providing suggestions and recommendations
- Having engaging conversations

Be friendly, professional, and thorough in your responses. Use markdown formatting when helpful.`;
    }

    /**
     * Send a message to DeepSeek and get a response
     * @param {string} message - The user's message
     * @returns {Promise<string>} - DeepSeek's response
     */
    async sendMessage(message) {
        const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

        if (!apiKey) {
            throw new Error('DeepSeek API key not configured. Please add VITE_DEEPSEEK_API_KEY to .env.local');
        }

        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...this.conversationHistory
                    ],
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content || 'No response generated';

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            // Remove the failed user message from history
            this.conversationHistory.pop();
            console.error('DeepSeek API error:', error);
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
     * @returns {Array} - Array of message objects
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Set a custom system prompt
     * @param {string} prompt - The new system prompt
     */
    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
    }
}

// Export singleton instance
export const deepseekService = new DeepSeekService();
export default deepseekService;
