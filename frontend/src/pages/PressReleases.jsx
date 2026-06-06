import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdVisibility } from 'react-icons/md';
import Table, { Pagination } from '../components/UI/Table.jsx';
import { ConfirmModal } from '../components/UI/Modal.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statusColors = { draft: 'badge-neutral', published: 'badge-success', archived: 'badge-warning' };
const categoryColors = { General: 'badge-info', Policy: 'badge-purple', Event: 'badge-teal', Achievement: 'badge-success', Emergency: 'badge-danger', Other: 'badge-neutral' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function PressReleases() {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/press-releases', {
        params: { page, limit: 10, search, status, category }
      });
      setItems(data.data);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, search, status, category]);

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await axios.delete(`/api/press-releases/${deleteId}`);
      setDeleteId(null);
      fetch();
    } catch (e) { console.error(e); }
    finally { setDelLoading(false); }
  };

  const columns = [
    { key: 'title', label: t('common.title'), render: (v) => <span className="td-title">{v}</span> },
    { key: 'category', label: t('common.category'), render: (v) => <span className={`badge ${categoryColors[v] || 'badge-neutral'}`}>{v}</span> },
    { key: 'status', label: t('common.status'), render: (v) => <span className={`badge ${statusColors[v]}`}>{t(`pressReleases.status.${v}`)}</span> },
    { key: 'author', label: t('common.author'), render: (v) => v?.name || '—' },
    { key: 'views', label: 'Views', render: (v) => <span style={{ color: 'var(--text-muted)' }}>{v}</span> },
    { key: 'createdAt', label: t('common.date'), render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(v)}</span> },
    ...(user?.role !== 'viewer' ? [{
      key: '_id', label: t('common.actions'), width: '120px',
      render: (v) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm btn-icon" title="Edit" onClick={() => navigate(`/press-releases/edit/${v}`)}><MdEdit size={15} /></button>
          <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleteId(v)}><MdDelete size={15} /></button>
        </div>
      )
    }] : [])
  ];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pressReleases.title')}</h1>
          <p className="page-subtitle">{t('pressReleases.subtitle')}</p>
        </div>
        {user?.role !== 'viewer' && (
          <Link to="/press-releases/new" className="btn btn-primary"><MdAdd size={18} />{t('pressReleases.addNew')}</Link>
        )}
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder={t('common.search')} value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select className="filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {['General','Policy','Event','Achievement','Emergency','Other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <Table columns={columns} data={items} loading={loading} emptyMessage="No press releases found" />
        <Pagination page={page} total={total} limit={10} onPage={setPage} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        loading={delLoading} title="Delete Press Release"
        message="Are you sure you want to delete this press release? This action cannot be undone." />
    </div>
  );
}
