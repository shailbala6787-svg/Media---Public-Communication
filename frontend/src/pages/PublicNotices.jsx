import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import Table, { Pagination } from '../components/UI/Table.jsx';
import { ConfirmModal } from '../components/UI/Modal.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const statusColors = { active: 'badge-success', expired: 'badge-warning', draft: 'badge-neutral' };
const priorityColors = { low: 'badge-info', medium: 'badge-neutral', high: 'badge-warning', urgent: 'badge-danger' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function PublicNotices() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/public-notices', { params: { page, limit: 10, search, status, priority } });
      setItems(data.data); setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, search, status, priority]);

  const handleDelete = async () => {
    setDelLoading(true);
    try { await axios.delete(`/api/public-notices/${deleteId}`); setDeleteId(null); fetch(); }
    catch (e) { console.error(e); } finally { setDelLoading(false); }
  };

  const columns = [
    { key: 'title', label: t('common.title'), render: (v) => <span className="td-title">{v}</span> },
    { key: 'department', label: t('common.department') },
    { key: 'priority', label: t('common.priority'), render: (v) => <span className={`badge ${priorityColors[v]}`}><span className={`priority-dot priority-${v}`} />{t(`publicNotices.priority.${v}`)}</span> },
    { key: 'status', label: t('common.status'), render: (v) => <span className={`badge ${statusColors[v]}`}>{t(`publicNotices.status.${v}`)}</span> },
    { key: 'deadline', label: t('publicNotices.deadline'), render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(v)}</span> },
    { key: 'createdAt', label: t('common.date'), render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(v)}</span> },
    {
      key: '_id', label: t('common.actions'), width: '120px',
      render: (v) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => navigate(`/public-notices/edit/${v}`)}><MdEdit size={15} /></button>
          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(v)}><MdDelete size={15} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('publicNotices.title')}</h1>
          <p className="page-subtitle">{t('publicNotices.subtitle')}</p>
        </div>
        <Link to="/public-notices/new" className="btn btn-primary"><MdAdd size={18} />{t('publicNotices.addNew')}</Link>
      </div>
      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
        </select>
        <select className="filter-select" value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <Table columns={columns} data={items} loading={loading} emptyMessage="No public notices found" />
        <Pagination page={page} total={total} limit={10} onPage={setPage} />
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={delLoading} title="Delete Notice" message="Are you sure you want to delete this public notice?" />
    </div>
  );
}
