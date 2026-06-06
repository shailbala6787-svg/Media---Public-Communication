import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { MdCameraAlt, MdCheckCircle } from 'react-icons/md';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dob: '',
    organization: 'UP Police',
    password: '',
    confirmPassword: ''
  });
  
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = () => {
    setUpdating(true);
    // Simulate API call to save profile details
    setTimeout(() => {
      setUpdating(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
          <div style={{ position: 'relative' }}>
            <div className="user-avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <button className="btn btn-secondary btn-icon" style={{ position: 'absolute', bottom: -5, right: -5, borderRadius: '50%', padding: 6 }} title="Change Photo">
              <MdCameraAlt size={16} />
            </button>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, color: 'var(--text-primary)' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" name="email" value={formData.email} readOnly style={{ background: 'var(--bg-elevated)', cursor: 'not-allowed' }} title="Email cannot be changed" />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input className="form-control" name="organization" value={formData.organization} onChange={handleChange} />
          </div>
        </div>

        <h3 style={{ marginTop: 20, marginBottom: 15, fontSize: 16, color: 'var(--text-primary)' }}>Change Password</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
          </div>
        </div>
        
        <div style={{ marginTop: 30 }}>
          {successMessage && (
            <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--teal-dim)', color: 'var(--teal)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <MdCheckCircle size={18} /> {successMessage}
            </div>
          )}
          <button className="btn btn-primary" onClick={handleUpdate} disabled={updating}>
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
