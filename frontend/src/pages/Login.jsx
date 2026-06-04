import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageToggle from '../components/UI/LanguageToggle.jsx';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <div style={{ position: 'absolute', top: 20, right: 24 }}>
        <LanguageToggle />
      </div>

      <div className="auth-card animate-slide">
        <div className="auth-logo">
          <div className="logo-icon" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,var(--accent),var(--purple))', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            📡
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Media &amp; <span style={{ color: 'var(--accent)' }}>Public</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Communication Portal</div>
          </div>
        </div>

        <h1 className="auth-title">{t('auth.loginTitle')}</h1>
        <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <div style={{ position: 'relative' }}>
              <MdEmail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
              <input
                id="login-email"
                type="email"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="admin@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <MdLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
              <input
                id="login-password"
                type="password"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner spinner-sm" /> : <MdLogin size={18} />}
            {t('auth.login')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.noAccount')}{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {t('auth.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
