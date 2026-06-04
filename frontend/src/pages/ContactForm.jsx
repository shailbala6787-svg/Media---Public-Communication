import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdReply, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { useLang } from '../context/LanguageContext.jsx';
import Loader from '../components/UI/Loader.jsx';

const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN') : '—';

export default function ContactForm() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`/api/contacts/${id}`)
      .then(r => setData(r.data.data))
      .catch(() => navigate('/contacts'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSaving(true);
    try {
      const r = await axios.post(`/api/contacts/${id}/reply`, { reply: replyText });
      setData(r.data.data);
      setReplyText('');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const markClosed = async () => {
    try {
      const r = await axios.put(`/api/contacts/${id}`, { status: 'closed' });
      setData(r.data.data);
    } catch (err) { console.error(err); }
  };

  if (loading) return <Loader />;
  if (!data) return null;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('contacts.viewTitle')}</h1>
          <p className="page-subtitle">From: {data.name} &lt;{data.email}&gt;</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {data.status !== 'closed' && (
            <button className="btn btn-secondary" onClick={markClosed}><MdCheckCircle size={18} /> Mark Closed</button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/contacts')}><MdArrowBack size={18} />{t('common.back')}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.1rem' }}>{data.subject}</h3>
              <span className={`badge badge-${data.status === 'new' ? 'danger' : data.status === 'replied' ? 'success' : 'neutral'}`}>{data.status.toUpperCase()}</span>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 'var(--radius)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {data.message}
            </div>
          </div>

          {data.reply && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <h4 style={{ marginBottom: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdReply /> Reply Sent ({fmtDate(data.repliedAt)})
              </h4>
              <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 'var(--radius)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {data.reply}
              </div>
            </div>
          )}

          {!data.reply && data.status !== 'closed' && (
            <div className="card">
              <h4 style={{ marginBottom: 16 }}>Send Reply</h4>
              <form onSubmit={handleReply}>
                <textarea className="form-control" rows={6} value={replyText} onChange={e => setReplyText(e.target.value)} required placeholder="Type your reply here. This will be sent to the user's email." style={{ marginBottom: 16 }} />
                <button type="submit" className="btn btn-primary" disabled={saving || !replyText.trim()}>
                  {saving ? <span className="spinner spinner-sm" /> : <MdReply size={18} />} Send Reply
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="card">
          <h4 style={{ marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Received</span>{fmtDate(data.createdAt)}</div>
            <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Name</span>{data.name}</div>
            <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Email</span><a href={`mailto:${data.email}`}>{data.email}</a></div>
            {data.phone && <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Phone</span>{data.phone}</div>}
            {data.organization && <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Organization</span>{data.organization}</div>}
            <div><span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Source</span><span style={{ textTransform: 'capitalize' }}>{data.source}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
