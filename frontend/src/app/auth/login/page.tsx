"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        router.push('/generate');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: 'var(--text)',
            marginBottom: '0.5rem',
            fontFamily: 'Syne, sans-serif',
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
          }}>
            Sign in to your Virlo account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,92,135,0.1)',
              border: '1px solid rgba(255,92,135,0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: 'var(--accent3)',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? 'var(--dim)' : 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--muted)',
        }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: '600',
          }}>
            Sign up
          </Link>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
        }}>
          <Link href="/" style={{
            color: 'var(--muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}