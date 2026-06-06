import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdNotifications, MdSettings, MdLogout, MdPerson, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import LanguageToggle from '../UI/LanguageToggle.jsx';

const breadcrumbMap = {
  '/': 'Dashboard',
  '/press-releases': 'Press Releases',
  '/press-releases/new': 'New Press Release',
  '/public-notices': 'Public Notices',
  '/public-notices/new': 'New Notice',
  '/media': 'Media Gallery',
  '/announcements': 'Announcements',
  '/announcements/new': 'New Announcement',
  '/contacts': 'Contact Inquiries',
  '/users': 'User Management',
};

export default function Header({ collapsed, onMobileMenu }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  
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

  const title = breadcrumbMap[location.pathname] ||
    (location.pathname.includes('/edit/') ? 'Edit' : 'Detail');

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className={`header${collapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Mobile menu button */}
      <button className="header-btn" onClick={onMobileMenu} style={{ display: 'none' }} id="mobile-menu-btn">
        <MdMenu />
      </button>

      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <div className="breadcrumb-title">{title}</div>
        <div className="breadcrumb-sub">Media &amp; Public Communication Portal</div>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <LanguageToggle />

        <button className="header-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
        </button>

        <button className="header-btn" title="Notifications">
          <MdNotifications />
        </button>

        {/* User dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div className="user-menu" onClick={() => setDropOpen(p => !p)}>
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>

          {dropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '8px', minWidth: '180px',
              zIndex: 200, boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.15s ease'
            }}>
              <button
                onClick={() => { setDropOpen(false); navigate('/profile'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 'var(--radius)', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <MdPerson size={16} /> Profile
              </button>
              <button
                onClick={() => { setDropOpen(false); navigate('/settings'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 'var(--radius)', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <MdSettings size={16} /> Settings
              </button>
              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 'var(--radius)', border: 'none', background: 'transparent', color: 'var(--rose)', fontSize: 13, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--rose-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <MdLogout size={16} /> {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
