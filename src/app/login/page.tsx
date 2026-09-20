"use client";

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Username atau password salah. Silakan coba lagi.');
      return;
    }

    const res = await fetch('/api/auth/session');
    const session = await res.json();
    const role = session?.user?.role;

    if (role === 'admin_space') {
      router.push('/admin');
    } else {
      router.push(redirect === '/admin' ? '/dashboard' : redirect);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: 'var(--spacing-8)', position: 'relative', zIndex: 1 }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
        <Link href="/" style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
          Ur<span className="text-gradient">Space</span>
        </Link>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)', marginBottom: 0 }}>
          Masuk ke akun Anda
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)',
          marginBottom: 'var(--spacing-4)', color: '#ef4444', fontSize: 'var(--font-size-sm)',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
            Username
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
            placeholder="Masukkan username Anda"
            required
            style={{
              width: '100%', padding: 'var(--spacing-3) var(--spacing-4)',
              background: 'var(--color-bg-tertiary)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)', outline: 'none', transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Masukkan password Anda"
            required
            style={{
              width: '100%', padding: 'var(--spacing-3) var(--spacing-4)',
              background: 'var(--color-bg-tertiary)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)', outline: 'none', transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', marginTop: 'var(--spacing-2)', gap: 'var(--spacing-2)', opacity: loading ? 0.7 : 1 }}
        >
          {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        Belum punya akun?{' '}
        <Link href="/register" style={{ color: 'var(--color-accent-primary)', fontWeight: 'var(--font-weight-medium)' }}>
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      padding: 'var(--spacing-6)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: '350px', height: '350px',
        background: 'var(--color-accent-primary)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: '300px', height: '300px',
        background: 'var(--color-accent-tertiary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', zIndex: 0,
      }} />

      <Suspense fallback={<div className="glass-panel" style={{ padding: 'var(--spacing-8)', color: 'var(--color-text-secondary)' }}>Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
