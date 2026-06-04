import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdLogin, MdLightMode, MdDarkMode } from 'react-icons/md';
import { FaFilePdf, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageToggle from '../components/UI/LanguageToggle.jsx';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
    <div className="login-split-layout">
      {/* Left Branding Section */}
      <div className="login-branding">
        <div className="branding-blob-1"></div>
        <div className="branding-blob-2"></div>
        
        <div className="branding-content animate-fade-in">
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--accent), var(--purple))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 32, boxShadow: 'var(--shadow-glow)' }}>
            <FaShieldAlt style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Media &amp; Public <br />
            <span style={{ color: 'var(--accent)' }}>Communication</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Official centralized portal for managing press releases, public notices, media resources, and AI-driven content synthesis.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="login-form-container">
        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
          <LanguageToggle />
          <button 
            onClick={toggleTheme} 
            title="Toggle Theme"
            style={{ 
              width: 38, height: 38, borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)', background: 'var(--bg-card)', 
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: 18, cursor: 'pointer', transition: 'all var(--transition)' 
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            {t('auth.loginTitle')}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
            {t('auth.loginSubtitle')}
          </p>

          {error && (
            <div style={{ padding: 16, background: 'var(--rose-dim)', color: 'var(--rose)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14, fontWeight: 500, display: 'flex', gap: 8 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('auth.email')}</label>
              <div style={{ position: 'relative' }}>
                <MdEmail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15 }}
                  placeholder="admin@up.police.gov.in"
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
                <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15 }}
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
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 16, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <><MdLogin size={20} /> {t('auth.login')}</>
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {t('auth.register')}
            </Link>
          </div>

          {/* SOP Section */}
          <div className="login-sop-section">
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
              Standard Operating Procedures (SOP)
            </h3>
            <div className="sop-links">
              <a href="/docs/sop-hindi.pdf" target="_blank" rel="noopener noreferrer" className="sop-link">
                <FaFilePdf className="sop-icon" /> SOP (Hindi)
              </a>
              <a href="/docs/sop-english.pdf" target="_blank" rel="noopener noreferrer" className="sop-link">
                <FaFilePdf className="sop-icon" /> SOP (English)
              </a>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              *Please review the guidelines before logging in.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
