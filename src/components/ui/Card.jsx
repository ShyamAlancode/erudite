// Card Component
// Glass-styled card container

export function Card({ children, className = '', glow = false, ...props }) {
    return (
        <div
            className={`
        glass-card p-6
        ${glow ? 'glow-border' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-xl font-semibold text-white ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={`text-gray-400 text-sm mt-1 ${className}`}>
            {children}
        </p>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default Card;
