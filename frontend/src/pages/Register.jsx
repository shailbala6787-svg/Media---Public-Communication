import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdPerson, MdAdminPanelSettings } from 'react-icons/md';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageToggle from '../components/UI/LanguageToggle.jsx';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'editor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div style={{ position: 'absolute', top: 20, right: 24 }}>
        <LanguageToggle />
      </div>

      <div className="auth-card animate-slide" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="logo-icon" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,var(--accent),var(--purple))', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📡</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Media &amp; <span style={{ color: 'var(--accent)' }}>Public</span></div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Communication Portal</div>
          </div>
        </div>

        <h1 className="auth-title">{t('auth.registerTitle')}</h1>
        <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('auth.name')}</label>
              <div style={{ position: 'relative' }}>
                <MdPerson style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
                <input id="reg-name" type="text" className="form-control" style={{ paddingLeft: 38 }}
                  placeholder="Full Name" value={form.name} onChange={set('name')} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('auth.role')}</label>
              <div style={{ position: 'relative' }}>
                <MdAdminPanelSettings style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
                <select id="reg-role" className="form-control" style={{ paddingLeft: 38 }} value={form.role} onChange={set('role')}>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <div style={{ position: 'relative' }}>
              <MdEmail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
              <input id="reg-email" type="email" className="form-control" style={{ paddingLeft: 38 }}
                placeholder="email@example.com" value={form.email} onChange={set('email')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <MdLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
                <input id="reg-password" type="password" className="form-control" style={{ paddingLeft: 38 }}
                  placeholder="••••••••" value={form.password} onChange={set('password')} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('auth.confirmPassword')}</label>
              <div style={{ position: 'relative' }}>
                <MdLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
                <input id="reg-confirm-password" type="password" className="form-control" style={{ paddingLeft: 38 }}
                  placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            </div>
          </div>

          <button id="reg-submit" type="submit" className="btn btn-primary w-full"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : null}
            {t('auth.register')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('auth.login')}</Link>
        </div>
      </div>
    </div>
  );
}
