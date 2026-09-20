"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all var(--transition-normal)',
        padding: scrolled ? 'var(--spacing-3) 0' : 'var(--spacing-6) 0',
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
          Ur<span className="text-gradient">Space</span>
        </Link>

        <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
          <Link href="#spaces" style={{ color: 'var(--color-text-primary)' }}>Spaces</Link>
          <Link href="#community" style={{ color: 'var(--color-text-primary)' }}>Community</Link>
          <Link href="#pricing" style={{ color: 'var(--color-text-primary)' }}>Pricing</Link>
          <button className="btn btn-primary">Book a Space</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
