'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'auth_callback_failed'
      ? 'Authentication failed. Please try again.'
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    });
    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  }

  const inputClass =
    'w-full h-10 rounded-lg border border-[#e2e2e9] bg-white px-3 text-sm text-[#111] placeholder:text-[#aaa] outline-none transition-shadow focus:shadow-[0_0_0_3px_#635BFF22] focus:border-[#635BFF]';

  return (
    <div className="w-full max-w-[360px]">
      {/* Wordmark */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#635BFF' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
              fill="white"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-[#111] tracking-tight">Vault</p>
          <p className="text-sm text-[#888] mt-0.5">Sign in to your account</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#e2e2e9] p-6 shadow-sm">
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-medium text-[#333] mb-1.5">Email</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#333]">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#635BFF] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-colors"
            style={{ background: loading ? '#4f48e2' : '#635BFF' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4f48e2'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#635BFF'; }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#e2e2e9]" />
          <span className="text-xs text-[#aaa]">or</span>
          <div className="flex-1 h-px bg-[#e2e2e9]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full h-10 rounded-lg border border-[#e2e2e9] bg-white text-sm font-medium text-[#333] flex items-center justify-center gap-2.5 hover:bg-[#fafafa] disabled:opacity-60 transition-colors"
        >
          {googleLoading ? (
            <span className="text-[#aaa] text-xs">Redirecting…</span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-[#999] mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#635BFF] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-[360px] h-96 rounded-2xl border border-[#e2e2e9] animate-pulse bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
