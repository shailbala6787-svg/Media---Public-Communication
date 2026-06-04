import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MdCloudUpload, MdDelete, MdSearch, MdImage, MdOndemandVideo, MdInsertDriveFile, MdAudiotrack } from 'react-icons/md';
import { ConfirmModal } from '../components/UI/Modal.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import Loader from '../components/UI/Loader.jsx';

const iconMap = { image: <MdImage />, video: <MdOndemandVideo />, document: <MdInsertDriveFile />, audio: <MdAudiotrack /> };
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function MediaGallery() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/media', { params: { search, type, limit: 100 } });
      setItems(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [search, type]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await axios.post('/api/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetch();
    } catch (err) { console.error(err); }
    finally { setUploading(false); fileRef.current.value = ''; }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try { await axios.delete(`/api/media/${deleteId}`); setDeleteId(null); fetch(); }
    catch (e) { console.error(e); } finally { setDelLoading(false); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('media.title')}</h1>
          <p className="page-subtitle">{t('media.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
          {uploading ? <span className="spinner spinner-sm" /> : <MdCloudUpload size={18} />}
          {t('media.addNew')}
        </button>
        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleUpload} />
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📂</div>
          <div className="empty-title">No media found</div>
          <div className="empty-desc">Upload some files to see them here</div>
        </div>
      ) : (
        <div className="media-grid">
          {items.map(item => (
            <div key={item._id} className="media-card">
              <div className="media-thumb">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title} loading="lazy" />
                ) : (
                  iconMap[item.type] || <MdInsertDriveFile />
                )}
              </div>
              <div className="media-info">
                <div className="media-title" title={item.title}>{item.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <div className="media-meta">{fmtDate(item.createdAt)} • {(item.size / 1024 / 1024).toFixed(1)}MB</div>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(item._id)} style={{ padding: 4 }}>
                    <MdDelete size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={delLoading} title="Delete Media" message="Are you sure you want to delete this media file? It may break links in published content." />
    </div>
  );
}
