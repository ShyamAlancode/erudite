// Chat Context
// Persists chat state across page navigation

import { createContext, useContext, useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';

const ChatContext = createContext(null);

// Separate context for PDF content to avoid circular dependency
const ChatPDFContext = createContext('');

export function ChatProvider({ children }) {
    // Persistent state - survives page navigation
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [difficulty, setDifficulty] = useState('beginner');
    const [pdfContent, setPdfContent] = useState('');

    /**
     * Set PDF content for chat context
     */
    const setChatPdfContent = useCallback((content) => {
        setPdfContent(content);
    }, []);

    /**
     * Send a message to Erudite
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
            // Initialize service with current settings
            geminiService.initializeChat(pdfContent, difficulty, '');

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
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'error',
                content: `Error: ${err.message}`,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [difficulty, pdfContent]);

    /**
     * Change difficulty level
     */
    const changeDifficulty = useCallback((newDifficulty) => {
        setDifficulty(newDifficulty);
        geminiService.setDifficulty(newDifficulty);
    }, []);

    /**
     * Clear chat history (only when user explicitly requests)
     */
    const clearChat = useCallback(() => {
        setMessages([]);
        geminiService.clearHistory();
    }, []);

    const value = {
        messages,
        isLoading,
        error,
        difficulty,
        sendMessage,
        changeDifficulty,
        clearChat,
        setChatPdfContent
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

export default ChatContext;
