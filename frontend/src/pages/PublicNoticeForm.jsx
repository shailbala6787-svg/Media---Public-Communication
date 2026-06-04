import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdSave, MdArrowBack, MdAttachFile } from 'react-icons/md';
import { useLang } from '../context/LanguageContext.jsx';
import Loader from '../components/UI/Loader.jsx';

const defaultForm = { title: '', description: '', department: '', noticeNumber: '', deadline: '', status: 'active', priority: 'medium', isPublic: true };

export default function PublicNoticeForm() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/public-notices/${id}`)
        .then(r => {
          const d = r.data.data;
          setForm({ title: d.title, description: d.description, department: d.department, noticeNumber: d.noticeNumber || '', deadline: d.deadline ? d.deadline.split('T')[0] : '', status: d.status, priority: d.priority, isPublic: d.isPublic });
        })
        .catch(() => navigate('/public-notices'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (isEdit) {
        await axios.put(`/api/public-notices/${id}`, form);
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (file) fd.append('attachment', file);
        await axios.post('/api/public-notices', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/public-notices');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? t('publicNotices.editTitle') : t('publicNotices.createTitle')}</h1>
          <p className="page-subtitle">{t('publicNotices.subtitle')}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/public-notices')}><MdArrowBack size={18} />{t('common.back')}</button>
      </div>
      {error && <div className="alert alert-error mb-16">⚠️ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div className="card">
            <div className="form-group">
              <label className="form-label">{t('common.title')} *</label>
              <input className="form-control" value={form.title} onChange={set('title')} required placeholder="Notice title" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.department')} *</label>
                <input className="form-control" value={form.department} onChange={set('department')} required placeholder="Department name" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('publicNotices.noticeNumber')}</label>
                <input className="form-control" value={form.noticeNumber} onChange={set('noticeNumber')} placeholder="e.g. NOT-2024-001" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description')} *</label>
              <textarea className="form-control" rows={8} value={form.description} onChange={set('description')} required placeholder="Notice details..." />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">{t('publicNotices.attachment')}</label>
                <div className="file-drop" onClick={() => document.getElementById('notice-file').click()}>
                  <div className="file-drop-icon"><MdAttachFile /></div>
                  <div className="file-drop-text">{file ? file.name : t('media.dragDrop')}</div>
                  <div className="file-drop-hint">PDF, DOC, DOCX up to 50MB</div>
                </div>
                <input id="notice-file" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="form-group">
                <label className="form-label">{t('common.status')}</label>
                <select className="form-control" value={form.status} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="expired">Expired</option>
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
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('publicNotices.deadline')}</label>
                <input type="date" className="form-control" value={form.deadline} onChange={set('deadline')} />
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
