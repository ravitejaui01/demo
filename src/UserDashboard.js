// src/UserDashboard.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Outfit', sans-serif; background: #060912; color: #e2e8f0; }

  .ud-root {
    min-height: 100vh;
    display: flex;
    background:
      radial-gradient(ellipse 60% 40% at 5% 20%, rgba(14,165,233,0.07) 0%, transparent 60%),
      #060912;
  }

  /* Sidebar */
  .ud-sidebar {
    width: 260px;
    background: rgba(15,20,35,0.98);
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
  }

  .ud-brand {
    display: flex; align-items: center; gap: 0.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 1.5rem;
  }

  .ud-brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #6366f1, #0ea5e9);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }

  .ud-brand-name {
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: #e2e8f0;
  }

  .ud-user-card {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 14px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .ud-user-card .role-pill {
    display: inline-block;
    background: rgba(14,165,233,0.15);
    border: 1px solid rgba(14,165,233,0.3);
    color: #7dd3fc;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 999px;
    margin-bottom: 0.5rem;
  }

  .ud-user-card .uname {
    font-weight: 700;
    font-size: 1rem;
  }

  .ud-user-card .uemail {
    color: #64748b;
    font-size: 0.8rem;
    margin-top: 2px;
  }

  .ud-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }

  .ud-nav-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.7rem 0.875rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #64748b;
    background: transparent;
    border: none;
    font-family: 'Outfit', sans-serif;
    width: 100%;
    text-align: left;
    transition: all 0.15s;
  }

  .ud-nav-item:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }
  .ud-nav-item.active { background: rgba(99,102,241,0.12); color: #a5b4fc; }

  .ud-logout {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .ud-logout button {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.7rem 0.875rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #ef4444;
    background: transparent;
    border: none;
    font-family: 'Outfit', sans-serif;
    width: 100%;
    text-align: left;
    transition: all 0.15s;
  }

  .ud-logout button:hover { background: rgba(239,68,68,0.08); }

  /* Main */
  .ud-main {
    margin-left: 260px;
    flex: 1;
    padding: 2rem 2.5rem;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .ud-page-header { margin-bottom: 2rem; }
  .ud-page-header h2 {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #f1f5f9;
  }
  .ud-page-header p { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }

  .ud-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }

  .ud-info-card {
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
  }

  .ud-info-card h3 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #475569;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .ud-field { margin-bottom: 0.875rem; }
  .ud-field:last-child { margin-bottom: 0; }
  .ud-field .label { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-bottom: 0.25rem; }
  .ud-field .value { font-size: 0.95rem; color: #e2e8f0; font-weight: 500; }

  .aadhar-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px;
    padding: 0.35rem 0.75rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: #a5b4fc;
    letter-spacing: 0.1em;
  }

  /* Upload zone */
  .upload-zone {
    border: 2px dashed rgba(99,102,241,0.3);
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    background: rgba(99,102,241,0.03);
    margin-bottom: 1.5rem;
  }

  .upload-zone:hover {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.07);
  }

  .upload-zone .zone-icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .upload-zone h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; }
  .upload-zone p { color: #64748b; font-size: 0.85rem; }

  .file-inputs { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }

  .file-row {
    display: flex; align-items: center; gap: 1rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 0.75rem 1rem;
  }

  .file-row label { font-size: 0.8rem; font-weight: 600; color: #64748b; width: 60px; }
  .file-row input[type="file"] { font-size: 0.85rem; color: #94a3b8; }
  .file-row input[type="file"]::-webkit-file-upload-button {
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    margin-right: 0.75rem;
    transition: all 0.15s;
  }
  .file-row input[type="file"]::-webkit-file-upload-button:hover {
    background: rgba(99,102,241,0.25);
  }

  .upload-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
    align-self: flex-start;
  }

  .upload-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.35); }
  .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }

  .media-card {
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    overflow: hidden;
  }

  .media-card img, .media-card video {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
  }

  .media-card .media-label {
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
  }

  .toast {
    position: fixed;
    bottom: 1.5rem; right: 1.5rem;
    padding: 0.875rem 1.25rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 999;
    animation: toastIn 0.3s ease;
  }

  @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .toast.success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
  .toast.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }

  .spinner-wrap { display: flex; align-items: center; justify-content: center; height: 60vh; }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState('profile');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Inject styles
  if (!document.getElementById('ud-styles')) {
    const s = document.createElement('style');
    s.id = 'ud-styles';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  useEffect(() => {
    if (!token || localStorage.getItem('roleId') !== '2') return navigate('/');
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    axios.get('http://localhost:5000/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data))
      .catch(() => navigate('/'));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async () => {
    if (!imageFile && !videoFile) return showToast('Select at least one file', 'error');
    setUploading(true);
    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      showToast('Files uploaded successfully!');
      setImageFile(null);
      setVideoFile(null);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    }
    setUploading(false);
  };

  if (!profile) return (
    <div className="ud-root">
      <div className="spinner-wrap"><div className="spinner" /></div>
    </div>
  );

  return (
    <div className="ud-root">
      {/* Sidebar */}
      <div className="ud-sidebar">
        <div className="ud-brand">
          <div className="ud-brand-icon">🏢</div>
          <div className="ud-brand-name">EmployeePortal</div>
        </div>

        <div className="ud-user-card">
          <div className="role-pill">Employee</div>
          <div className="uname">{profile.firstName} {profile.lastName}</div>
          <div className="uemail">{profile.username}</div>
        </div>

        <div className="ud-nav">
          {[
            { id: 'profile', icon: '👤', label: 'My Profile' },
            { id: 'upload', icon: '📤', label: 'Upload Files' },
            { id: 'files', icon: '🖼️', label: 'My Files' },
          ].map(n => (
            <button
              key={n.id}
              className={`ud-nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </div>

        <div className="ud-logout">
          <button onClick={() => { localStorage.clear(); navigate('/'); }}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ud-main">

        {/* ── PROFILE PAGE ── */}
        {page === 'profile' && (
          <>
            <div className="ud-page-header">
              <h2>My Profile</h2>
              <p>Your personal and employment details</p>
            </div>

            <div className="ud-cards">
              <div className="ud-info-card">
                <h3>Personal Info</h3>
                <div className="ud-field"><div className="label">First Name</div><div className="value">{profile.firstName || '—'}</div></div>
                <div className="ud-field"><div className="label">Last Name</div><div className="value">{profile.lastName || '—'}</div></div>
                <div className="ud-field"><div className="label">Username</div><div className="value">{profile.username || '—'}</div></div>
                <div className="ud-field"><div className="label">Email</div><div className="value">{profile.email || '—'}</div></div>
                <div className="ud-field">
                  <div className="label">Date of Birth</div>
                  <div className="value">{profile.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</div>
                </div>
                <div className="ud-field"><div className="label">Company</div><div className="value">{profile.company || '—'}</div></div>
              </div>

              <div className="ud-info-card">
                <h3>Security Details</h3>
                <div className="ud-field">
                  <div className="label">Aadhar Number</div>
                  <div className="value">
                    <span className="aadhar-badge">🔒 {profile.aadhar || '—'}</span>
                  </div>
                </div>
                <div className="ud-field">
                  <div className="label">Account Created</div>
                  <div className="value">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</div>
                </div>
                <div className="ud-field">
                  <div className="label">Last Updated</div>
                  <div className="value">{profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : '—'}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── UPLOAD PAGE ── */}
        {page === 'upload' && (
          <>
            <div className="ud-page-header">
              <h2>Upload Files</h2>
              <p>Upload your profile image and video</p>
            </div>

            <div className="ud-info-card" style={{ maxWidth: 560 }}>
              <h3>Select Files</h3>
              <div className="file-inputs">
                <div className="file-row">
                  <label>🖼️ Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="file-row">
                  <label>🎬 Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files[0])}
                  />
                </div>
                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading…' : '📤 Upload Files'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── FILES PAGE ── */}
        {page === 'files' && (
          <>
            <div className="ud-page-header">
              <h2>My Files</h2>
              <p>Your uploaded images and videos</p>
            </div>

            {!profile.image && !profile.video ? (
              <div className="ud-info-card" style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                No files uploaded yet. Go to Upload Files.
              </div>
            ) : (
              <div className="media-grid">
                {profile.image && (
                  <div className="media-card">
                    <img src={`http://localhost:5000${profile.image}`} alt="profile" />
                    <div className="media-label">🖼️ Profile Image</div>
                  </div>
                )}
                {profile.video && (
                  <div className="media-card">
                    <video src={`http://localhost:5000${profile.video}`} controls />
                    <div className="media-label">🎬 Profile Video</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}