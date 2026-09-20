"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4) var(--spacing-6)' }}>
        <Link href="/" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
          Ur<span className="text-gradient">Space</span>
        </Link>

        <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)' }} className="desktop-nav">
            {[['/', 'Beranda'], ['#spaces', 'Space'], ['#promo', 'Promo']].map(([href, label]) => (
              <Link key={href} href={href} style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', transition: 'color var(--transition-fast)' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-2) var(--spacing-5)', textDecoration: 'none' }}>Masuk</Link>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-2) var(--spacing-5)', textDecoration: 'none' }}>Daftar</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
