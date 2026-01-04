// Main App Component
// Entry point with authentication routing

import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PDFProvider } from './context/PDFContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './pages/Dashboard';
import './index.css';

// Authentication wrapper component
function AuthenticatedApp() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-accent-purple mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan 
                          flex items-center justify-center mx-auto mb-4 animate-float">
              <span className="text-4xl font-bold text-white">E</span>
            </div>
            <h1 className="text-4xl font-bold glow-text mb-2">Erudite</h1>
            <p className="text-gray-400">Your Autonomous Teaching Agent</p>
          </div>

          {showLogin ? (
            <Login onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <PDFProvider>
      <Dashboard />
    </PDFProvider>
  );
}

// Main App with providers
function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
