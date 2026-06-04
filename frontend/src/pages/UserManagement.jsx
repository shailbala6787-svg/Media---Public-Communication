import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdCheck, MdClose } from 'react-icons/md';
import Table, { Pagination } from '../components/UI/Table.jsx';
import Modal, { ConfirmModal } from '../components/UI/Modal.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const roleColors = { admin: 'badge-danger', editor: 'badge-info', viewer: 'badge-neutral' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : 'Never';

export default function UserManagement() {
  const { t } = useLang();
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/users', { params: { page, limit: 10, search } });
      setItems(data.data); setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, search]);

  const openModal = (user = null) => {
    setEditUser(user);
    if (user) setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
    else setForm({ name: '', email: '', password: '', role: 'editor', isActive: true });
    setError(''); setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editUser) await axios.put(`/api/users/${editUser._id}`, { name: form.name, email: form.email, role: form.role, isActive: form.isActive });
      else await axios.post('/api/users', form);
      setModalOpen(false); fetch();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try { await axios.delete(`/api/users/${deleteId}`); setDeleteId(null); fetch(); }
    catch (e) { console.error(e); } finally { setDelLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const columns = [
    { key: 'name', label: t('users.name'), render: (v, r) => (
      <div>
        <div className="td-title">{v} {r._id === currentUser.id && <span className="badge badge-info" style={{ padding: '1px 6px', fontSize: 9 }}>YOU</span>}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.email}</div>
      </div>
    )},
    { key: 'role', label: t('users.role'), render: (v) => <span className={`badge ${roleColors[v]}`}>{v.toUpperCase()}</span> },
    { key: 'isActive', label: t('users.isActive'), render: (v) => v ? <span style={{ color: 'var(--green)' }}><MdCheck size={18} /></span> : <span style={{ color: 'var(--rose)' }}><MdClose size={18} /></span> },
    { key: 'createdAt', label: 'Joined', render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(v)}</span> },
    {
      key: '_id', label: t('common.actions'), width: '120px',
      render: (v) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openModal(items.find(i => i._id === v))}><MdEdit size={15} /></button>
          <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(v)} disabled={v === currentUser.id}><MdDelete size={15} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('users.title')}</h1>
          <p className="page-subtitle">{t('users.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}><MdAdd size={18} />{t('users.addNew')}</button>
      </div>
      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder="Search users by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <Table columns={columns} data={items} loading={loading} emptyMessage="No users found" />
        <Pagination page={page} total={total} limit={10} onPage={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? t('users.editTitle') : t('users.createTitle')}>
        {error && <div className="alert alert-error mb-16">⚠️ {error}</div>}
        <form onSubmit={handleSave} id="user-form">
          <div className="form-group">
            <label className="form-label">{t('users.name')} *</label>
            <input className="form-control" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('users.email')} *</label>
            <input type="email" className="form-control" value={form.email} onChange={set('email')} required />
          </div>
          {!editUser && (
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-control" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('users.role')}</label>
              <select className="form-control" value={form.role} onChange={set('role')} disabled={editUser?._id === currentUser.id}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.isActive} onChange={set('isActive')} disabled={editUser?._id === currentUser.id} style={{ width: 16, height: 16 }} />
                Account Active
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner spinner-sm" />} {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={delLoading} title="Delete User" message="Are you sure you want to delete this user? This cannot be undone." />
    </div>
  );
}
