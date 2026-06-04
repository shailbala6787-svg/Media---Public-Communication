import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdSave, MdArrowBack, MdAttachFile } from 'react-icons/md';
import { useLang } from '../context/LanguageContext.jsx';
import Loader from '../components/UI/Loader.jsx';

const defaultForm = { title: '', summary: '', content: '', category: 'General', status: 'draft', tags: '' };

export default function PressReleaseForm() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/press-releases/${id}`)
        .then(r => {
          const d = r.data.data;
          setForm({ title: d.title, summary: d.summary || '', content: d.content, category: d.category, status: d.status, tags: (d.tags || []).join(', ') });
        })
        .catch(() => navigate('/press-releases'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('attachments', f));
      if (isEdit) await axios.put(`/api/press-releases/${id}`, form);
      else await axios.post('/api/press-releases', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/press-releases');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? t('pressReleases.editTitle') : t('pressReleases.createTitle')}</h1>
          <p className="page-subtitle">{t('pressReleases.subtitle')}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/press-releases')}><MdArrowBack size={18} />{t('common.back')}</button>
      </div>

      {error && <div className="alert alert-error mb-16">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Main */}
          <div className="card">
            <div className="form-group">
              <label className="form-label">{t('common.title')} *</label>
              <input className="form-control" value={form.title} onChange={set('title')} required placeholder="Enter press release title" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('pressReleases.summary')}</label>
              <textarea className="form-control" rows={3} value={form.summary} onChange={set('summary')} placeholder="Brief summary (optional)" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('pressReleases.content')} *</label>
              <textarea className="form-control" rows={12} value={form.content} onChange={set('content')} required placeholder="Full press release content..." style={{ minHeight: 240 }} />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label className="form-label">{t('pressReleases.attachments')}</label>
                <div className="file-drop" onClick={() => document.getElementById('pr-files').click()}>
                  <div className="file-drop-icon"><MdAttachFile /></div>
                  <div className="file-drop-text">{t('media.dragDrop')}</div>
                  <div className="file-drop-hint">{t('media.maxSize')}</div>
                  {files.length > 0 && <div style={{ marginTop: 10, color: 'var(--teal)', fontSize: 13 }}>{files.length} file(s) selected</div>}
                </div>
                <input id="pr-files" type="file" multiple style={{ display: 'none' }} onChange={e => setFiles([...e.target.files])} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="form-group">
                <label className="form-label">{t('common.status')}</label>
                <select className="form-control" value={form.status} onChange={set('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.category')}</label>
                <select className="form-control" value={form.category} onChange={set('category')}>
                  {['General','Policy','Event','Achievement','Emergency','Other'].map(c => <option key={c} value={c}>{t(`pressReleases.categories.${c}`)}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('pressReleases.tags')}</label>
                <input className="form-control" value={form.tags} onChange={set('tags')} placeholder="Comma separated tags" />
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
