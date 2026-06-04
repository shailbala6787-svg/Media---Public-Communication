import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed(p => !p)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Header
          collapsed={collapsed}
          onMobileMenu={() => setMobileOpen(p => !p)}
        />
        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
