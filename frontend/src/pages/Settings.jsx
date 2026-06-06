import React from 'react';

export default function Settings() {
  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Application preferences and configuration</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ marginTop: 0, marginBottom: 20, color: 'var(--text-primary)' }}>Notifications</h3>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="email-notif" defaultChecked style={{ width: 16, height: 16 }} />
          <label htmlFor="email-notif" style={{ color: 'var(--text-secondary)' }}>Email Notifications</label>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="sms-notif" style={{ width: 16, height: 16 }} />
          <label htmlFor="sms-notif" style={{ color: 'var(--text-secondary)' }}>SMS Notifications</label>
        </div>
        
        <div style={{ height: 1, background: 'var(--border)', margin: '30px 0' }} />
        
        <h3 style={{ marginTop: 0, marginBottom: 20, color: 'var(--text-primary)' }}>Security</h3>
        <button className="btn btn-secondary" disabled>Change Password (Coming Soon)</button>
      </div>
    </div>
  );
}
