// Authentication Context
// Provides authentication state and methods throughout the app

import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Wraps the app to provide auth state to all children
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    /**
     * Register a new user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    async function register(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    }

    /**
     * Log in an existing user
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    async function login(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    }

    /**
     * Log out the current user
     */
    async function logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Context value object
    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to use authentication context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(code) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please register first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
}

export default AuthContext;
