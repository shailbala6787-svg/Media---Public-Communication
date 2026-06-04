import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdSearch, MdVisibility } from 'react-icons/md';
import Table, { Pagination } from '../components/UI/Table.jsx';
import { ConfirmModal } from '../components/UI/Modal.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const statusColors = { new: 'badge-danger', read: 'badge-info', replied: 'badge-success', closed: 'badge-neutral' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function Contacts() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/contacts', { params: { page, limit: 10, search, status } });
      setItems(data.data); setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, search, status]);

  const handleDelete = async () => {
    setDelLoading(true);
    try { await axios.delete(`/api/contacts/${deleteId}`); setDeleteId(null); fetch(); }
    catch (e) { console.error(e); } finally { setDelLoading(false); }
  };

  const columns = [
    { key: 'name', label: t('common.title'), render: (v, r) => (
      <div>
        <div className="td-title">{v}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.email}</div>
      </div>
    ) },
    { key: 'subject', label: t('contacts.subject') },
    { key: 'status', label: t('common.status'), render: (v) => <span className={`badge ${statusColors[v]}`}>{t(`contacts.status.${v}`)}</span> },
    { key: 'createdAt', label: t('common.date'), render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(v)}</span> },
    {
      key: '_id', label: t('common.actions'), width: '120px',
      render: (v) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => navigate(`/contacts/${v}`)}><MdVisibility size={15} /></button>
          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(v)}><MdDelete size={15} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('contacts.title')}</h1>
          <p className="page-subtitle">{t('contacts.subtitle')}</p>
        </div>
      </div>
      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <Table columns={columns} data={items} loading={loading} emptyMessage="No inquiries found" />
        <Pagination page={page} total={total} limit={10} onPage={setPage} />
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={delLoading} title="Delete Contact" message="Are you sure you want to delete this inquiry?" />
    </div>
  );
}
