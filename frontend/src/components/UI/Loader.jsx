import React from 'react';

export default function Loader({ fullScreen = false, size = 'md' }) {
  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', zIndex: 9999, flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="loader-overlay">
      <div className={`spinner${size === 'sm' ? ' spinner-sm' : ''}`} />
    </div>
  );
}

export function InlineLoader() {
  return <span className="spinner spinner-sm" style={{ display: 'inline-block' }} />;
}
