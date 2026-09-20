"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, User, Building2 } from 'lucide-react';

type RegisterType = 'member' | 'admin-space';

export default function RegisterPage() {
  const router = useRouter();
  const [regType, setRegType] = useState<RegisterType>('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    // Member fields
    namaMember: '', instansi: '', telp: '', alamat: '',
    // Admin fields
    namaCoworking: '', namaPemilik: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok'); return;
    }

    setLoading(true);

    const payload = regType === 'member'
      ? { username: form.username, password: form.password, namaMember: form.namaMember, instansi: form.instansi, telp: form.telp, alamat: form.alamat }
      : { username: form.username, password: form.password, namaCoworking: form.namaCoworking, namaPemilik: form.namaPemilik, telp: form.telp };

    const res = await fetch(`/api/auth/register/${regType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.status) { setError(data.message); return; }

    setSuccess('Registrasi berhasil! Mengarahkan ke halaman login...');
    setTimeout(() => router.push('/login'), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: 'var(--spacing-3) var(--spacing-4)',
    background: 'var(--color-bg-tertiary)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)', padding: 'var(--spacing-6)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--color-accent-secondary)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }} />

      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: 'var(--spacing-8)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <Link href="/" style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
            Ur<span className="text-gradient">Space</span>
          </Link>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)', marginBottom: 0 }}>Buat akun baru</p>
        </div>

        {/* Type Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
          {(['member', 'admin-space'] as RegisterType[]).map((t) => (
            <button key={t} type="button" onClick={() => setRegType(t)}
              style={{
                padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: `1px solid ${regType === t ? 'var(--color-accent-primary)' : 'var(--glass-border)'}`,
                background: regType === t ? 'rgba(99,102,241,0.15)' : 'var(--color-bg-tertiary)',
                color: regType === t ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {t === 'member' ? <User size={16} /> : <Building2 size={16} />}
              {t === 'member' ? 'Member' : 'Admin Space'}
            </button>
          ))}
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', marginBottom: 'var(--spacing-4)', color: '#ef4444', fontSize: 'var(--font-size-sm)' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', marginBottom: 'var(--spacing-4)', color: 'var(--color-success)', fontSize: 'var(--font-size-sm)' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Username *</label>
              <input type="text" style={inputStyle} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required placeholder="username" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>No. Telepon</label>
              <input type="text" style={inputStyle} value={form.telp} onChange={e => setForm(f => ({ ...f, telp: e.target.value }))} placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          {regType === 'member' ? (
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Nama Lengkap *</label>
              <input type="text" style={inputStyle} value={form.namaMember} onChange={e => setForm(f => ({ ...f, namaMember: e.target.value }))} required placeholder="Nama lengkap Anda" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Nama Coworking *</label>
                <input type="text" style={inputStyle} value={form.namaCoworking} onChange={e => setForm(f => ({ ...f, namaCoworking: e.target.value }))} required placeholder="Nama space" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Nama Pemilik *</label>
                <input type="text" style={inputStyle} value={form.namaPemilik} onChange={e => setForm(f => ({ ...f, namaPemilik: e.target.value }))} required placeholder="Nama Anda" />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Password *</label>
              <input type="password" style={inputStyle} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 6 karakter" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)', color: 'var(--color-text-primary)' }}>Konfirmasi Password *</label>
              <input type="password" style={inputStyle} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required placeholder="Ulangi password" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', gap: 'var(--spacing-2)', opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={18} />}
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: 'var(--color-accent-primary)', fontWeight: 'var(--font-weight-medium)' }}>Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
