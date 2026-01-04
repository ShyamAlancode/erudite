// useChat Hook
// Manages chat state and interactions with Erudite

import { useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { usePDF } from '../context/PDFContext';

/**
 * Custom hook for chat functionality
 * @returns {Object} Chat state and methods
 */
export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [difficulty, setDifficulty] = useState('beginner');
    const { pdfContent } = usePDF();

    /**
     * Initialize the chat session with PDF content
     */
    const initializeChat = useCallback((learningState = '') => {
        geminiService.initializeChat(pdfContent, difficulty, learningState);
    }, [pdfContent, difficulty]);

    /**
     * Send a message and get a response from Erudite
     * @param {string} content - The user's message
     */
    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;

        // Add user message immediately
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Initialize if not already done
            if (!geminiService.hasPDFContext() && pdfContent) {
                geminiService.initializeChat(pdfContent, difficulty, '');
            }

            // Get response from Erudite
            const response = await geminiService.sendMessage(content);

            // Add assistant message
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            setError(err.message);
            // Add error message
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'error',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [pdfContent, difficulty]);

    /**
     * Change the difficulty level
     * @param {string} newDifficulty - beginner/intermediate/exam
     */
    const changeDifficulty = useCallback((newDifficulty) => {
        setDifficulty(newDifficulty);
        geminiService.setDifficulty(newDifficulty);
    }, []);

    /**
     * Clear chat history
     */
    const clearChat = useCallback(() => {
        setMessages([]);
        geminiService.clearHistory();
    }, []);

    return {
        messages,
        isLoading,
        error,
        difficulty,
        sendMessage,
        changeDifficulty,
        clearChat,
        initializeChat
    };
}

export default useChat;
