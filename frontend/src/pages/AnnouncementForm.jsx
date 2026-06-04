import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdSave, MdArrowBack } from 'react-icons/md';
import { useLang } from '../context/LanguageContext.jsx';
import Loader from '../components/UI/Loader.jsx';

const defaultForm = { title: '', body: '', priority: 'medium', status: 'active', targetAudience: 'all', expiresAt: '', scheduledAt: '', pinned: false };

export default function AnnouncementForm() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/announcements/${id}`)
        .then(r => {
          const d = r.data.data;
          setForm({
            title: d.title, body: d.body, priority: d.priority, status: d.status,
            targetAudience: d.targetAudience, pinned: d.pinned,
            expiresAt: d.expiresAt ? d.expiresAt.split('T')[0] : '',
            scheduledAt: d.scheduledAt ? d.scheduledAt.split('T')[0] : ''
          });
        })
        .catch(() => navigate('/announcements'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const toggle = (k) => () => setForm(p => ({ ...p, [k]: !p[k] }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (isEdit) await axios.put(`/api/announcements/${id}`, form);
      else await axios.post('/api/announcements', form);
      navigate('/announcements');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? t('announcements.editTitle') : t('announcements.createTitle')}</h1>
          <p className="page-subtitle">{t('announcements.subtitle')}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/announcements')}><MdArrowBack size={18} />{t('common.back')}</button>
      </div>
      {error && <div className="alert alert-error mb-16">⚠️ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div className="card">
            <div className="form-group">
              <label className="form-label">{t('common.title')} *</label>
              <input className="form-control" value={form.title} onChange={set('title')} required placeholder="Announcement headline" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('announcements.body')} *</label>
              <textarea className="form-control" rows={12} value={form.body} onChange={set('body')} required placeholder="Full announcement text..." style={{ minHeight: 240 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="form-group">
                <label className="form-label">{t('common.status')}</label>
                <select className="form-control" value={form.status} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.priority')}</label>
                <select className="form-control" value={form.priority} onChange={set('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('announcements.targetAudience')}</label>
                <select className="form-control" value={form.targetAudience} onChange={set('targetAudience')}>
                  <option value="all">Everyone</option>
                  <option value="staff">Staff Only</option>
                  <option value="public">Public</option>
                  <option value="media">Media</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.pinned} onChange={toggle('pinned')} style={{ width: 16, height: 16 }} />
                  {t('announcements.pinned')}
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">{t('announcements.scheduledAt')} (Optional)</label>
                <input type="date" className="form-control" value={form.scheduledAt} onChange={set('scheduledAt')} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('announcements.expiresAt')} (Optional)</label>
                <input type="date" className="form-control" value={form.expiresAt} onChange={set('expiresAt')} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
              {saving ? <span className="spinner spinner-sm" /> : <MdSave size={18} />}
              {t('common.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
