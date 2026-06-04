import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MdArticle, MdAnnouncement, MdPermMedia, MdCampaign,
  MdContacts, MdPeople, MdTrendingUp, MdFiberNew
} from 'react-icons/md';
import { RiMegaphoneLine } from 'react-icons/ri';
import { StatCard } from '../components/UI/Card.jsx';
import { MonthlyBarChart, ContactPieChart, MediaTypeChart } from '../components/Charts/DashboardCharts.jsx';
import Loader from '../components/UI/Loader.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const statusColors = {
  draft: 'badge-neutral', published: 'badge-success', archived: 'badge-warning',
  new: 'badge-danger', read: 'badge-info', replied: 'badge-success', closed: 'badge-neutral'
};

export default function Dashboard() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const { totals = {}, highlights = {}, charts = {}, recent = {} } = data || {};

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), var(--bg-elevated))', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ marginBottom: 16, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent)' }}>⚡</span> Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="/ai-generator" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--purple), var(--accent))' }}>
            ✨ AI Media Studio
          </a>
          <a href="/press-releases/new" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 'var(--radius-lg)' }}>
            📝 New Press Release
          </a>
          <a href="/announcements/new" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 'var(--radius-lg)' }}>
            📢 Broadcast Announcement
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard label={t('dashboard.totalPressReleases')} value={totals.pressReleases} icon={<MdArticle />} color="accent" />
        <StatCard label={t('dashboard.totalNotices')} value={totals.publicNotices} icon={<MdAnnouncement />} color="teal" />
        <StatCard label={t('dashboard.totalMedia')} value={totals.mediaItems} icon={<MdPermMedia />} color="purple" />
        <StatCard label={t('dashboard.totalAnnouncements')} value={totals.announcements} icon={<RiMegaphoneLine />} color="amber" />
        <StatCard label={t('dashboard.totalContacts')} value={totals.contacts} icon={<MdContacts />} color="rose" />
        <StatCard label={t('dashboard.totalUsers')} value={totals.users} icon={<MdPeople />} color="green" />
      </div>

      {/* Highlights */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card rose">
          <div className="stat-icon rose"><MdFiberNew /></div>
          <div className="stat-info">
            <div className="stat-value">{highlights.newContacts ?? 0}</div>
            <div className="stat-label">{t('dashboard.newContacts')}</div>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber"><RiMegaphoneLine /></div>
          <div className="stat-info">
            <div className="stat-value">{highlights.activeAnnouncements ?? 0}</div>
            <div className="stat-label">{t('dashboard.activeAnnouncements')}</div>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon accent"><MdTrendingUp /></div>
          <div className="stat-info">
            <div className="stat-value">{highlights.publishedPR ?? 0}</div>
            <div className="stat-label">{t('dashboard.publishedPR')}</div>
          </div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon teal"><MdAnnouncement /></div>
          <div className="stat-info">
            <div className="stat-value">{highlights.activeNotices ?? 0}</div>
            <div className="stat-label">{t('dashboard.activeNotices')}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>{t('dashboard.monthlyActivity')}</h3>
          <MonthlyBarChart data={charts.monthlyPR} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>{t('dashboard.contactStatus')}</h3>
          <ContactPieChart data={charts.contactStats} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-grid">
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{t('dashboard.recentPressReleases')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(recent.pressReleases || []).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No recent press releases</div>
            )}
            {(recent.pressReleases || []).map(pr => (
              <div key={pr._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pr.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{fmtDate(pr.createdAt)}</div>
                </div>
                <span className={`badge ${statusColors[pr.status] || 'badge-neutral'}`}>{pr.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{t('dashboard.recentContacts')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(recent.contacts || []).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No recent contacts</div>
            )}
            {(recent.contacts || []).map(c => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name} — {c.subject}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{fmtDate(c.createdAt)}</div>
                </div>
                <span className={`badge ${statusColors[c.status] || 'badge-neutral'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
