'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect handled by middleware
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-text-primary font-display">
            School Hub
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Modern collaboration for schools
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-muted disabled:opacity-50 text-bg-base font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bg-base text-text-muted">Or continue with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-border hover:border-accent bg-bg-surface hover:bg-bg-elevated transition-colors py-2 rounded-lg font-medium text-text-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>🔐</span>
          Google Sign In
        </button>

        {/* Signup Link */}
        <p className="text-center mt-6 text-text-muted text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent-muted font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
