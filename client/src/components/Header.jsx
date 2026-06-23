import React from 'react';

export default function Header() {
  return (
    <div style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      padding: '0 28px',
      height: 58,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        width: 32, height: 32,
        background: 'var(--accent)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>🚗</div>
      <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>CarFind IL</span>
      <span style={{ fontSize: 12, color: 'var(--muted2)', marginRight: 2 }}>מוצא הרכב שלך</span>
    </div>
  );
}
