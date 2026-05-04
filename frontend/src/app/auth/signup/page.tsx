"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>
            ✅
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text)',
            marginBottom: '0.5rem',
            fontFamily: 'Syne, sans-serif',
          }}>
            Check Your Email
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            We've sent you a confirmation link. Click the link to activate your account.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            fontFamily: 'Syne, sans-serif',
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
            Create Account
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
          }}>
            Start creating viral videos today
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

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--muted)',
        }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: '600',
          }}>
            Sign in
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