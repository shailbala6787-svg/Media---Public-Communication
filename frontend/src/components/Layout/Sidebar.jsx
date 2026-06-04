import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MdDashboard, MdArticle, MdAnnouncement, MdPermMedia,
  MdCampaign, MdContacts, MdPeople, MdChevronLeft, MdChevronRight
} from 'react-icons/md';
import { RiMegaphoneLine } from 'react-icons/ri';
import { useLang } from '../../context/LanguageContext.jsx';

const navItems = [
  {
    section: 'main',
    items: [
      { path: '/', icon: <MdDashboard />, key: 'nav.dashboard', exact: true },
    ]
  },
  {
    section: 'content',
    items: [
      { path: '/press-releases', icon: <MdArticle />, key: 'nav.pressReleases' },
      { path: '/public-notices', icon: <MdAnnouncement />, key: 'nav.publicNotices' },
      { path: '/media', icon: <MdPermMedia />, key: 'nav.mediaGallery' },
      { path: '/announcements', icon: <RiMegaphoneLine />, key: 'nav.announcements' },
    ]
  },
  {
    section: 'manage',
    items: [
      { path: '/contacts', icon: <MdContacts />, key: 'nav.contacts' },
      { path: '/users', icon: <MdPeople />, key: 'nav.userManagement' },
    ]
  }
];

const sectionLabels = {
  main: '',
  content: 'Content',
  manage: 'Management'
};

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }) {
  const { t } = useLang();
  const location = useLocation();

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">📡</div>
        <div className="logo-text">
          <div>Media &amp; <span>Public</span></div>
          <div style={{ fontSize: '10px', fontWeight: 400, color: 'var(--text-muted)' }}>Communication Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            {sectionLabels[section] && (
              <div className="nav-section-label">{sectionLabels[section]}</div>
            )}
            {items.map(({ path, icon, key, exact }) => (
              <NavLink
                key={path}
                to={path}
                end={exact}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onMobileClose}
                title={collapsed ? t(key) : undefined}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{t(key)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer toggle */}
      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle}>
          <span className="nav-icon">
            {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
          </span>
          <span className="nav-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
