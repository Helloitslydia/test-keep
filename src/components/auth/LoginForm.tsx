import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { SignUpModal } from './SignUpModal';
import { supabase } from '../../lib/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Use the specified demo credentials
      await login('demo@afd.fr', 'demo123');
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Error accessing demo account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-blue-400 blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute -right-[20%] top-[20%] w-[50%] h-[50%] rounded-full bg-purple-400 blur-[100px] opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute left-[10%] -bottom-[10%] w-[45%] h-[45%] rounded-full bg-pink-400 blur-[100px] opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Header with Sign up button */}
      <header className="relative z-10 w-full backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Real Time Monitoring NGO</span>
            </div>
            <button 
              onClick={() => setIsSignUpOpen(true)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full backdrop-blur-xl bg-white/70 p-8 rounded-2xl shadow-lg border border-white/20">
            <div className="text-center mb-12">
              <LogIn className="mx-auto h-12 w-12 text-gray-900" />
              <h2 className="mt-6 text-3xl font-light">
                Welcome back
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to manage your projects
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="input-field bg-white/50 backdrop-blur-lg border-white/30 focus:bg-white/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="input-field bg-white/50 backdrop-blur-lg border-white/30 focus:bg-white/70"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button 
                type="submit" 
                className="btn-primary w-full bg-black hover:bg-gray-900"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              <button 
                type="button" 
                onClick={handleDemoLogin}
                className="w-full px-6 py-3 text-gray-700 backdrop-blur-lg bg-white/50 border border-white/30 rounded-lg hover:bg-white/30 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Loading demo...' : 'Try Demo'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </div>
  );
}