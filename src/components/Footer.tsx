import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      background: 'var(--color-bg-tertiary)', 
      padding: 'var(--spacing-12) 0 var(--spacing-6)',
      borderTop: '1px solid var(--glass-border)'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-12)'
        }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-4)' }}>
              Ur<span className="text-gradient">Space</span>
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Empowering creators and innovators with premium workspaces designed for the future of work.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Locations</h4>
            <ul style={{ listStyle: 'none', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>Downtown Hub</Link></li>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>Tech Park</Link></li>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>Riverside Campus</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Company</h4>
            <ul style={{ listStyle: 'none', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>About Us</Link></li>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>Careers</Link></li>
              <li style={{ marginBottom: 'var(--spacing-2)' }}><Link href="#" style={{ color: 'inherit' }}>Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          paddingTop: 'var(--spacing-6)', 
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xs)'
        }}>
          © {new Date().getFullYear()} Ur-Space. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
