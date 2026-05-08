'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Sign up
      const { error: signupError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (signupError) throw signupError;

      // Create profile
      if (data.user) {
        const username = email.split('@')[0] + Math.random().toString(36).substr(2, 5);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            full_name: fullName,
            role: 'student',
          });

        if (profileError) throw profileError;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2 font-display">
            Account Created!
          </h2>
          <p className="text-text-muted mb-4">
            Check your email to verify your account. Redirecting...
          </p>
          <div className="animate-pulse flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="w-2 h-2 rounded-full bg-accent"></div>
          </div>
        </div>
      </div>
    );
  }

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
            Create your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4 mb-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

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
            <p className="text-xs text-text-muted mt-1">
              At least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-muted disabled:opacity-50 text-bg-base font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-text-muted text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-muted font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
