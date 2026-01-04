// Register Component
// Allows new users to create an account

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Register({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        const result = await register(email, password);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    }

    return (
        <div className="glass-card p-8 w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold glow-text mb-2">Create Account</h1>
                <p className="text-gray-400">Start your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-white/10 text-white 
                       focus:border-accent-purple focus:ring-1 focus:ring-accent-purple 
                       transition-all duration-300 outline-none"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-white/10 text-white 
                       focus:border-accent-purple focus:ring-1 focus:ring-accent-purple 
                       transition-all duration-300 outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-white/10 text-white 
                       focus:border-accent-purple focus:ring-1 focus:ring-accent-purple 
                       transition-all duration-300 outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 glass-button text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-accent-purple hover:text-accent-pink transition-colors"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;
