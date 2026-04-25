'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock sleep
    await new Promise((res) => setTimeout(res, 1000));
    setIsSubmitting(false);
    window.location.href = '/'; // Fake redirect after auth
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-primary/10 pointer-events-none z-0"></div>
      
      <div className="glass-panel p-8 md:p-10 rounded-2xl w-full max-w-md relative z-10 border border-primary/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
        
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                AQ
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access your Pro account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#0f1115] border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
              placeholder="you@agency.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-[#0f1115] border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] mt-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don't have an account? <span className="text-primary hover:text-primary-hover cursor-pointer font-medium">Create a Free Account</span>
        </p>

      </div>
    </div>
  );
}
