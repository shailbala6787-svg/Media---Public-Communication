import React from 'react';

export default function Card({ children, className = '', glass = false, style = {} }) {
  return (
    <div className={`${glass ? 'card-glass' : 'card'} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color = 'accent', change, changeDir }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
        {change !== undefined && (
          <div className={`stat-change ${changeDir || 'up'}`}>
            {changeDir === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
}
