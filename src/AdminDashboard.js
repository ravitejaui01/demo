// src/AdminDashboard.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Outfit', sans-serif; background: #060912; color: #e2e8f0; }

  .ad-root {
    min-height: 100vh;
    display: flex;
    background:
      radial-gradient(ellipse 60% 40% at 5% 20%, rgba(239,68,68,0.05) 0%, transparent 60%),
      #060912;
  }

  /* Sidebar */
  .ad-sidebar {
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

  .ad-brand {
    display: flex; align-items: center; gap: 0.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 1.5rem;
  }

  .ad-brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);
  }

  .ad-brand-name { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; }

  .ad-user-card {
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 14px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .ad-user-card .role-pill {
    display: inline-block;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.3);
    color: #fca5a5;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 999px;
    margin-bottom: 0.5rem;
  }

  .ad-user-card .aname { font-weight: 700; font-size: 1rem; }
  .ad-user-card .ausername { color: #64748b; font-size: 0.8rem; margin-top: 2px; }

  .ad-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }

  .ad-nav-btn {
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

  .ad-nav-btn:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }
  .ad-nav-btn.active { background: rgba(239,68,68,0.1); color: #fca5a5; }

  .ad-logout { margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
  .ad-logout button {
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
  .ad-logout button:hover { background: rgba(239,68,68,0.08); }

  /* Main */
  .ad-main { margin-left: 260px; flex: 1; padding: 2rem 2.5rem; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .ad-page-header { margin-bottom: 2rem; }
  .ad-page-header h2 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
  .ad-page-header p { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }

  /* Stats */
  .stats-row { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .stat-card {
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    min-width: 160px;
  }
  .stat-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 0.4rem; }
  .stat-value { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; }

  /* Info cards */
  .ad-info-card {
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
  }

  .ad-info-card h3 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #475569;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }

  .ad-field .label { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-bottom: 0.2rem; }
  .ad-field .value { font-size: 0.95rem; color: #e2e8f0; font-weight: 500; }

  /* Search */
  .search-wrap {
    display: flex; align-items: center; gap: 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.65rem 1rem;
    margin-bottom: 1.25rem;
  }

  .search-wrap input {
    border: none; background: transparent;
    color: #e2e8f0; font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; outline: none; flex: 1;
  }

  .search-wrap input::placeholder { color: #334155; }

  /* Table */
  .table-wrap {
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
  }

  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 0.9rem 1.25rem;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #475569;
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  td {
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.875rem;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.015); }

  .td-name { font-weight: 600; color: #e2e8f0; }
  .td-sub { font-size: 0.78rem; color: #64748b; margin-top: 2px; }

  .aadhar-chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 6px;
    padding: 0.2rem 0.6rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #a5b4fc;
    letter-spacing: 0.05em;
  }

  .pwd-chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 6px;
    padding: 0.2rem 0.6rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #fca5a5;
    letter-spacing: 0.05em;
  }

  .view-btn {
    padding: 0.35rem 0.875rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 7px;
    color: #94a3b8;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .view-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; background: rgba(99,102,241,0.06); }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 1rem;
  }

  .modal {
    background: #0f1423;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 2rem;
    max-width: 680px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeIn 0.3s ease;
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .modal-header h3 { font-size: 1.2rem; font-weight: 800; }

  .close-btn {
    padding: 0.3rem 0.75rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: #64748b;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .close-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }

  .modal-section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
  }
  .modal-section h4 {
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: #475569;
    margin-bottom: 0.875rem; padding-bottom: 0.625rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.875rem; margin-top: 0.5rem; }
  .media-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
  .media-card img, .media-card video { width: 100%; height: 140px; object-fit: cover; display: block; }
  .media-card .media-lbl { padding: 0.4rem 0.7rem; font-size: 0.75rem; color: #64748b; }

  .empty-state { text-align: center; padding: 3rem; color: #334155; font-size: 0.9rem; }

  .spinner-wrap { display: flex; align-items: center; justify-content: center; height: 60vh; }
  .spinner { width: 36px; height: 36px; border: 3px solid rgba(239,68,68,0.15); border-top-color: #ef4444; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function AdminDashboard() {
  const [tab, setTab] = useState('personal');
  const [adminProfile, setAdminProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!document.getElementById('ad-styles')) {
    const s = document.createElement('style');
    s.id = 'ad-styles';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  useEffect(() => {
    if (!token || localStorage.getItem('roleId') !== '1') return navigate('/');
    // Load admin profile + all users in parallel
    Promise.all([
      axios.get('http://localhost:5000/me', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/admin/users', { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([meRes, usersRes]) => {
        setAdminProfile(meRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q)
    );
  });

  const logout = () => { localStorage.clear(); navigate('/'); };

  if (loading) return (
    <div className="ad-root">
      <div className="spinner-wrap"><div className="spinner" /></div>
    </div>
  );

  return (
    <div className="ad-root">
      {/* Sidebar */}
      <div className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-brand-icon">🛡️</div>
          <div className="ad-brand-name">Admin Panel</div>
        </div>

        <div className="ad-user-card">
          <div className="role-pill">Administrator</div>
          <div className="aname">{adminProfile?.firstName} {adminProfile?.lastName}</div>
          <div className="ausername">@{adminProfile?.username}</div>
        </div>

        <div className="ad-nav">
          <button
            className={`ad-nav-btn ${tab === 'personal' ? 'active' : ''}`}
            onClick={() => setTab('personal')}
          >
            <span>👤</span> Personal Info
          </button>
          <button
            className={`ad-nav-btn ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <span>👥</span> Users Data
            <span style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: '999px' }}>
              {users.length}
            </span>
          </button>
        </div>

        <div className="ad-logout">
          <button onClick={logout}><span>🚪</span> Logout</button>
        </div>
      </div>

      {/* Main */}
      <div className="ad-main">

        {/* ── PERSONAL INFO ── */}
        {tab === 'personal' && adminProfile && (
          <>
            <div className="ad-page-header">
              <h2>Personal Info</h2>
              <p>Your administrator account details</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="ad-info-card">
                <h3>Account Details</h3>
                <div className="field-grid">
                  {[
                    ['First Name', adminProfile.firstName],
                    ['Last Name', adminProfile.lastName],
                    ['Username', adminProfile.username],
                    ['Email', adminProfile.email],
                    ['Date of Birth', adminProfile.dob ? new Date(adminProfile.dob).toLocaleDateString() : '—'],
                    ['Company', adminProfile.company],
                  ].map(([l, v]) => (
                    <div key={l} className="ad-field">
                      <div className="label">{l}</div>
                      <div className="value">{v || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ad-info-card">
                <h3>System Info</h3>
                <div className="ad-field" style={{ marginBottom: '0.875rem' }}>
                  <div className="label">Role</div>
                  <div className="value">
                    <span style={{ display:'inline-block', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5', fontSize:'0.75rem', fontWeight:700, padding:'2px 10px', borderRadius:'999px', textTransform:'uppercase', letterSpacing:'0.07em' }}>
                      Administrator
                    </span>
                  </div>
                </div>
                <div className="ad-field" style={{ marginBottom: '0.875rem' }}>
                  <div className="label">Account Created</div>
                  <div className="value">{adminProfile.createdAt ? new Date(adminProfile.createdAt).toLocaleDateString() : '—'}</div>
                </div>
                <div className="ad-field">
                  <div className="label">Total Employees Managed</div>
                  <div className="value" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fca5a5' }}>{users.length}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── USERS DATA ── */}
        {tab === 'users' && (
          <>
            <div className="ad-page-header">
              <h2>Users Data</h2>
              <p>All registered employee accounts with decrypted details</p>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Total Employees</div>
                <div className="stat-value" style={{ color: '#a5b4fc' }}>{users.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">With Images</div>
                <div className="stat-value" style={{ color: '#86efac' }}>{users.filter(u => u.image).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">With Videos</div>
                <div className="stat-value" style={{ color: '#fde68a' }}>{users.filter(u => u.video).length}</div>
              </div>
            </div>

            <div className="search-wrap">
              <span style={{ color: '#334155' }}>🔍</span>
              <input
                placeholder="Search by name, username, email, company…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Company</th>
                    <th>Aadhar (Last 4)</th>
                    <th>Password (Decrypted)</th>
                    <th>Files</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-state">No employees found</div></td></tr>
                  ) : filtered.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="td-name">{u.firstName} {u.lastName}</div>
                        <div className="td-sub">@{u.username} {u.email ? `· ${u.email}` : ''}</div>
                      </td>
                      <td>{u.company || '—'}</td>
                      <td>
                        <span className="aadhar-chip">🔒 {u.aadharMasked || '—'}</span>
                      </td>
                      <td>
                        <span className="pwd-chip">🔒 {u.passwordHashed}</span>
                      </td>
                      <td>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                          {[u.image && '🖼️', u.video && '🎬'].filter(Boolean).join(' ') || '—'}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn" onClick={() => setSelected(u)}>
                          View All →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>👤 {selected.firstName} {selected.lastName}</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>✕ Close</button>
            </div>

            <div className="modal-section">
              <h4>Personal Details</h4>
              <div className="field-grid">
                {[
                  ['Username', `@${selected.username}`],
                  ['Email', selected.email],
                  ['Company', selected.company],
                  ['Date of Birth', selected.dob ? new Date(selected.dob).toLocaleDateString() : '—'],
                  ['Joined', selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—'],
                  ['Last Updated', selected.updatedAt ? new Date(selected.updatedAt).toLocaleDateString() : '—'],
                ].map(([l, v]) => (
                  <div key={l} className="ad-field">
                    <div className="label">{l}</div>
                    <div className="value">{v || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>🔐 Security — Admin View</h4>
              <div className="ad-field" style={{ marginBottom: '0.875rem' }}>
                <div className="label">Aadhar (Full — Decrypted)</div>
                <div className="value">
                  <span className="aadhar-chip" style={{ fontSize: '0.95rem', padding: '0.3rem 0.875rem' }}>
                    🔒 {selected.aadharMasked?.replace(/X/g, '•') || '—'}
                  </span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                    (last 4: {selected.aadharMasked?.slice(-4)})
                  </span>
                </div>
              </div>
              <div className="ad-field">
                <div className="label">Password (Decrypted)</div>
                <div className="value">
                  <span className="pwd-chip" style={{ fontSize: '0.95rem', padding: '0.3rem 0.875rem' }}>
                   🔒 {selected.passwordHashed}
                  </span>
                </div>
              </div>
            </div>

            {(selected.image || selected.video) ? (
              <div className="modal-section">
                <h4>📁 Uploaded Files</h4>
                <div className="media-grid">
                  {selected.image && (
                    <div className="media-card">
                      <img src={`http://localhost:5000${selected.image}`} alt="employee" />
                      <div className="media-lbl">🖼️ Image</div>
                    </div>
                  )}
                  {selected.video && (
                    <div className="media-card">
                      <video src={`http://localhost:5000${selected.video}`} controls />
                      <div className="media-lbl">🎬 Video</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="modal-section">
                <h4>📁 Uploaded Files</h4>
                <div style={{ color: '#475569', fontSize: '0.875rem' }}>No files uploaded by this employee.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}