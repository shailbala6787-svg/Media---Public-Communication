import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVpnKey, MdArrowBack, MdLightMode, MdDarkMode } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import LanguageToggle from '../components/UI/LanguageToggle.jsx';
import axios from 'axios';
import './Login.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. OTP might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-layout">
      {/* Left Branding Section (Reused from Login) */}
      <div className="login-branding">
        <div className="branding-blob-1"></div>
        <div className="branding-blob-2"></div>
        
        <div className="branding-content animate-fade-in">
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--accent), var(--purple))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 32, boxShadow: 'var(--shadow-glow)' }}>
            <FaShieldAlt style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Password <br />
            <span style={{ color: 'var(--accent)' }}>Recovery</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Regain access to the official portal securely.
          </p>
        </div>
      </div>

      {/* Right Recovery Section */}
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
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 24, fontSize: 14, fontWeight: 500, transition: 'color var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color='var(--accent)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
            <MdArrowBack size={18} /> Back to Login
          </Link>
          
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.5 }}>
            {step === 1 
              ? "Enter your registered email address and we'll send you an OTP to reset your password." 
              : "Enter the 6-digit OTP sent to your email and choose a new password."}
          </p>

          {error && (
            <div style={{ padding: 16, background: 'var(--rose-dim)', color: 'var(--rose)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14, fontWeight: 500, display: 'flex', gap: 8 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: 16, background: 'var(--emerald-dim)', color: 'var(--emerald)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14, fontWeight: 500, display: 'flex', gap: 8 }}>
              <span>✅</span> {successMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <MdEmail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15 }}
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 16, fontSize: 16 }}
                disabled={loading || !email}
              >
                {loading ? (
                  <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <div style={{ position: 'relative' }}>
                  <MdVpnKey style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                  <input
                    type="text"
                    className="form-control otp-input"
                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 18, letterSpacing: 4 }}
                    placeholder="------"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15 }}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 20 }} />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15 }}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 16, fontSize: 16 }}
                disabled={loading || !otp || !newPassword || !confirmPassword}
              >
                {loading ? (
                  <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
