// Typing Indicator Component
// Shows animated dots while Erudite is thinking

export function TypingIndicator() {
    return (
        <div className="flex justify-start mb-4">
            <div className="glass-dark rounded-2xl rounded-bl-sm px-5 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                        <span className="text-xs font-bold">E</span>
                    </div>
                    <span className="text-sm font-medium text-accent-cyan">Erudite is thinking</span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <div className="w-2 h-2 bg-accent-purple rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-accent-purple rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-accent-purple rounded-full typing-dot"></div>
                </div>
            </div>
        </div>
    );
}

export default TypingIndicator;
