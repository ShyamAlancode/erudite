// Chat Interface Component
// Main chat UI for interacting with Erudite

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { usePDF } from '../../context/PDFContext';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export function ChatInterface() {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, difficulty, sendMessage, changeDifficulty, clearChat } = useChat();
    const { hasPDF } = usePDF();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const message = input;
        setInput('');
        await sendMessage(message);
    }

    const difficultyOptions = [
        { value: 'beginner', label: 'Beginner', description: 'Simple analogies, no jargon' },
        { value: 'intermediate', label: 'Intermediate', description: 'Technical terms with explanations' },
        { value: 'exam', label: 'Exam-Focused', description: 'Key formulas & exam patterns' }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Difficulty Selector */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-400 mr-2">Difficulty:</span>
                    {difficultyOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => changeDifficulty(option.value)}
                            className={`
                px-3 py-1.5 rounded-lg text-sm transition-all duration-300
                ${difficulty === option.value
                                    ? 'bg-accent-purple text-white'
                                    : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-700'
                                }
              `}
                            title={option.description}
                        >
                            {option.label}
                        </button>
                    ))}

                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="ml-auto text-sm text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Clear Chat
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {!hasPDF && messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-6 animate-float">
                            <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Upload a Document First</h3>
                        <p className="text-gray-400 max-w-sm">
                            I need to understand your study material before I can help you learn.
                            Please upload a PDF to get started.
                        </p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center mb-6 animate-float">
                            <span className="text-3xl font-bold text-white">E</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Ready to Learn!</h3>
                        <p className="text-gray-400 max-w-sm mb-6">
                            I've analyzed your document. Ask me anything about it, and I'll help you understand
                            with explanations tailored to your level.
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p>💡 Try asking:</p>
                            <p className="text-accent-cyan">"What are the main concepts in this document?"</p>
                            <p className="text-accent-cyan">"Explain [topic] to me as a beginner"</p>
                            <p className="text-accent-cyan">"What should I focus on for exams?"</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={hasPDF ? "Ask me about your study material..." : "Please upload a PDF first..."}
                        disabled={!hasPDF || isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white
                       placeholder-gray-500 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple
                       transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!hasPDF || isLoading || !input.trim()}
                        className="px-6 py-3 glass-button text-white font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatInterface;
