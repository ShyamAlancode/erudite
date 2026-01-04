// Aletheia Chatbot Component
// General-purpose AI chatbot powered by Gemini

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { aletheiaService } from '../../services/aletheiaService';

export function DeepSeekChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await aletheiaService.sendMessage(input.trim());

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
    }

    function handleClearChat() {
        setMessages([]);
        aletheiaService.clearHistory();
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Aletheia</h2>
                        <p className="text-xs text-gray-400">Your AI Assistant</p>
                    </div>
                </div>

                {messages.length > 0 && (
                    <button
                        onClick={handleClearChat}
                        className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                    >
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 animate-float">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Aletheia</h3>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Your general-purpose AI assistant. Ask me anything!
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p>💡 Try asking:</p>
                            <p className="text-cyan-400">"Explain quantum computing in simple terms"</p>
                            <p className="text-cyan-400">"Write a Python function to sort a list"</p>
                            <p className="text-cyan-400">"What are the benefits of meditation?"</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`
                    max-w-[80%] rounded-2xl px-5 py-3
                    ${message.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-br-sm'
                                            : message.role === 'error'
                                                ? 'bg-red-500/20 border border-red-500/30 text-red-300 rounded-bl-sm'
                                                : 'glass-dark text-gray-100 rounded-bl-sm'
                                        }
                  `}
                                >
                                    {message.role !== 'user' && message.role !== 'error' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <span className="text-xs font-bold">A</span>
                                            </div>
                                            <span className="text-sm font-medium text-cyan-400">Aletheia</span>
                                        </div>
                                    )}

                                    {message.role === 'user' ? (
                                        <p>{message.content}</p>
                                    ) : (
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="text-cyan-400 font-semibold">{children}</strong>,
                                                    code: ({ inline, children }) =>
                                                        inline
                                                            ? <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-sm">{children}</code>
                                                            : <pre className="bg-dark-800 p-3 rounded-lg overflow-x-auto my-2"><code>{children}</code></pre>,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="glass-dark rounded-2xl rounded-bl-sm px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <span className="text-xs font-bold">A</span>
                                        </div>
                                        <span className="text-sm font-medium text-cyan-400">Aletheia is thinking</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                        placeholder="Ask Aletheia anything..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white
                       placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                       transition-all duration-300 outline-none disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium
                       rounded-xl disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
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

export default DeepSeekChat;
