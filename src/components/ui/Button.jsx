// Button Component
// Reusable button with variants

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    ...props
}) {
    const baseStyles = 'font-medium transition-all duration-300 flex items-center justify-center gap-2';

    const variants = {
        primary: 'glass-button text-white',
        secondary: 'bg-dark-600 border border-white/10 text-white hover:bg-dark-700 hover:border-accent-purple/50',
        ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
        danger: 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2.5 rounded-xl',
        lg: 'px-6 py-3 text-lg rounded-xl'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}

export default Button;
