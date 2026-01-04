// Message Bubble Component
// Displays individual chat messages

import ReactMarkdown from 'react-markdown';

export function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`
          max-w-[80%] rounded-2xl px-5 py-3
          ${isUser
                        ? 'bg-gradient-to-br from-accent-purple to-accent-blue text-white rounded-br-sm'
                        : isError
                            ? 'bg-red-500/20 border border-red-500/30 text-red-300 rounded-bl-sm'
                            : 'glass-dark text-gray-100 rounded-bl-sm'
                    }
        `}
            >
                {!isUser && !isError && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                            <span className="text-xs font-bold">E</span>
                        </div>
                        <span className="text-sm font-medium text-accent-cyan">Erudite</span>
                    </div>
                )}

                <div className={`${!isUser ? 'markdown-content' : ''}`}>
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <ReactMarkdown
                            components={{
                                // Custom styling for markdown elements
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="text-accent-purple font-semibold">{children}</strong>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                code: ({ inline, children }) =>
                                    inline
                                        ? <code className="bg-accent-purple/20 px-1.5 py-0.5 rounded text-sm">{children}</code>
                                        : <pre className="bg-dark-800 p-3 rounded-lg overflow-x-auto my-2"><code>{children}</code></pre>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent-purple pl-4 my-2 italic text-gray-300">
                                        {children}
                                    </blockquote>
                                )
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>

                <div className={`text-xs mt-2 ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;
