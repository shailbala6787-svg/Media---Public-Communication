import React, { useState } from 'react';
import axios from 'axios';
import { FaMagic, FaCopy, FaCheck, FaWhatsapp, FaFacebook, FaTwitter, FaSms, FaRegNewspaper, FaShieldAlt } from 'react-icons/fa';
import { MdLanguage, MdRecordVoiceOver } from 'react-icons/md';
import './AIContentGenerator.css';

const platformIcons = {
  press_release: <FaRegNewspaper />,
  whatsapp: <FaWhatsapp />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
  sms: <FaSms />
};

const upDistricts = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", 
  "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", 
  "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", 
  "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", 
  "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", 
  "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", 
  "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", 
  "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", 
  "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", 
  "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", 
  "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

export default function AIContentGenerator() {
  const [formData, setFormData] = useState({
    incident_type: '',
    district: '',
    location: '',
    officer_name: '',
    incident_details: '',
    key_facts: '',
    date: new Date().toISOString().split('T')[0],
    language_instruction: 'Both',
    tone: 'official',
    sensitivity: 'medium',
    platforms: ['press_release', 'whatsapp', 'facebook', 'twitter', 'sms']
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlatformToggle = (platform) => {
    const isChecked = formData.platforms.includes(platform);
    const updatedPlatforms = isChecked 
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  const handleSensitivitySelect = (value) => {
    setFormData({ ...formData, sensitivity: value });
  };

  const generateContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/ai/generate', formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content. Please check API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="page-wrapper">
      
      {/* Header Section */}
      <div className="ai-studio-header">
        <div className="ai-blob ai-blob-1"></div>
        <div className="ai-blob ai-blob-2"></div>
        
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.5rem', marginBottom: '16px' }}>
          <FaMagic className="text-amber" />
          AI Media Studio
        </h1>
        <p className="text-secondary" style={{ maxWidth: '600px', fontSize: '15px' }}>
          Instantly generate professional, multi-platform media content for the UP Police using advanced AI. Tailor the tone, sensitivity, and language with a single click.
        </p>
      </div>

      <div className="ai-content-layout">
        {/* Form Section */}
        <div className="card ai-form-card">
          <div className="ai-section-title">
            <span className="ai-section-icon">📝</span>
            Incident Details
          </div>
          
          <form onSubmit={generateContent}>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Incident Type</label>
                <select required name="incident_type" value={formData.incident_type} onChange={handleInputChange} className="form-control">
                  <option value="" disabled>Select Incident Type</option>
                  <option value="Arrest">Arrest</option>
                  <option value="Rescue">Rescue</option>
                  <option value="Encounter">Encounter</option>
                  <option value="Missing Person">Missing Person</option>
                  <option value="Traffic Incident">Traffic Incident</option>
                  <option value="Protest / Riot">Protest / Riot</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Theft / Robbery">Theft / Robbery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-control" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">District</label>
                <select required name="district" value={formData.district} onChange={handleInputChange} className="form-control">
                  <option value="" disabled>Select District</option>
                  {upDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input required name="location" value={formData.location} onChange={handleInputChange} className="form-control" placeholder="e.g. Hazratganj Chowk" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Officer Name / Designation</label>
              <input required name="officer_name" value={formData.officer_name} onChange={handleInputChange} className="form-control" placeholder="e.g. SP City" />
            </div>

            <div className="form-group">
              <label className="form-label">Incident Description</label>
              <textarea required name="incident_details" value={formData.incident_details} onChange={handleInputChange} className="form-control" placeholder="Brief description of what happened..." />
            </div>

            <div className="form-group">
              <label className="form-label">Key Facts <span style={{ textTransform: 'none', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Optional)</span></label>
              <textarea name="key_facts" value={formData.key_facts} onChange={handleInputChange} className="form-control" style={{ minHeight: '60px' }} placeholder="e.g. 2 arrested, 1 illegal weapon recovered" />
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-light)' }}>
                    <MdLanguage /> Language
                  </label>
                  <select name="language_instruction" value={formData.language_instruction} onChange={handleInputChange} className="form-control">
                    <option value="Both">Both (Hindi & English)</option>
                    <option value="Hindi only">Hindi Only</option>
                    <option value="English only">English Only</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-light)' }}>
                    <MdRecordVoiceOver /> Tone
                  </label>
                  <select name="tone" value={formData.tone} onChange={handleInputChange} className="form-control">
                    <option value="official">Official (Formal)</option>
                    <option value="alert">Alert (Urgent)</option>
                    <option value="awareness">Awareness (Educational)</option>
                    <option value="achievement">Achievement (Celebratory)</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-light)' }}>
                  <FaShieldAlt /> Sensitivity Level
                </label>
                <div className="ai-options-grid">
                  {[
                    { val: 'high', label: 'High', sub: 'Redact Names' },
                    { val: 'medium', label: 'Medium', sub: 'Redact Details' },
                    { val: 'low', label: 'Low', sub: 'Public Safe' }
                  ].map(s => (
                    <div 
                      key={s.val} 
                      className={`ai-option-card ${formData.sensitivity === s.val ? 'active' : ''}`}
                      onClick={() => handleSensitivitySelect(s.val)}
                    >
                      <div className="ai-option-title">{s.label}</div>
                      <div className="ai-option-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Platforms</label>
              <div className="ai-platform-chips">
                {['press_release', 'whatsapp', 'facebook', 'twitter', 'sms'].map(platform => {
                  const isChecked = formData.platforms.includes(platform);
                  return (
                    <div 
                      key={platform} 
                      className={`ai-chip ${isChecked ? 'active' : ''}`}
                      onClick={() => handlePlatformToggle(platform)}
                    >
                      {platformIcons[platform]}
                      {platform.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary ai-submit-btn">
              {loading ? 'Synthesizing...' : <><FaMagic /> Generate AI Content</>}
            </button>
            {error && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--rose-dim)', color: 'var(--rose)', borderRadius: 'var(--radius)', fontSize: '13px', display: 'flex', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="card ai-result-area">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="ai-section-title" style={{ marginBottom: 0 }}>
              <span className="ai-section-icon" style={{ color: 'var(--teal)', borderColor: 'var(--teal-dim)', background: 'var(--teal-dim)' }}>✨</span>
              Generated Output
            </div>
            {result?.redacted && (
              <span className="badge badge-danger" style={{ padding: '4px 12px' }}>
                <FaShieldAlt /> Redacted
              </span>
            )}
          </div>
          
          {!result && !loading && (
            <div className="ai-empty-state">
              <FaMagic className="ai-empty-icon" />
              <h3 style={{ fontSize: '16px' }}>Awaiting Instructions</h3>
              <p style={{ maxWidth: '250px', fontSize: '13px' }}>Fill in the incident details and click generate to see the AI synthesize official media content.</p>
            </div>
          )}

          {loading && (
            <div className="ai-loader">
              <div className="ai-spinner"></div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>Synthesizing Content</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Applying UP Police official guidelines...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="ai-output-list">
              {Object.entries(result).filter(([k]) => k !== 'redacted').map(([platform, text]) => (
                <div key={platform} className="ai-output-card">
                  <div className="ai-output-header">
                    <div className="ai-output-title">
                      <span style={{ color: 'var(--accent)' }}>{platformIcons[platform]}</span>
                      {platform.replace('_', ' ')}
                    </div>
                    <button 
                      onClick={() => handleCopy(text, platform)} 
                      className={`ai-btn-copy ${copiedKey === platform ? 'copied' : ''}`}
                    >
                      {copiedKey === platform ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
                    </button>
                  </div>
                  <div className="ai-output-content">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
