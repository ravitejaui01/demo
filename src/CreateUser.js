// src/CreateUser.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', sans-serif; background: #060912; color: #e2e8f0; min-height: 100vh; }

  .cu-root {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    background:
      radial-gradient(ellipse 80% 50% at 10% 60%, rgba(14,165,233,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 30%, rgba(99,102,241,0.06) 0%, transparent 60%),
      #060912;
  }

  .cu-card {
    width: 100%; max-width: 540px;
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 25px 80px rgba(0,0,0,0.6);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)  scale(1);    }
  }

  .cu-header { text-align: center; margin-bottom: 2rem; }
  .cu-header-icon {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, #6366f1, #0ea5e9);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  }
  .cu-header h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
  .cu-header p { color: #64748b; font-size: 0.875rem; margin-top: 0.3rem; }

  .role-tabs {
    display: flex; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 4px; margin-bottom: 1.5rem; gap: 4px;
  }
  .rtab {
    flex: 1; padding: 0.6rem; border: none; border-radius: 9px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.875rem; font-weight: 600;
    background: transparent; color: #64748b; transition: all 0.2s;
  }
  .rtab.active { background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
  .rtab.active-admin { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
  .form-full { grid-column: 1 / -1; }

  .cu-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .cu-field label {
    font-size: 0.75rem; font-weight: 600; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cu-field input, .cu-field select {
    padding: 0.75rem 0.875rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #e2e8f0;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cu-field input:focus, .cu-field select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .cu-field input::placeholder { color: #334155; }
  .cu-field select option { background: #0f1423; }

  .submit-btn {
    width: 100%; padding: 0.9rem; border: none; border-radius: 12px;
    font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; margin-top: 0.5rem;
    background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff;
    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.4); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .submit-btn.admin-mode { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 20px rgba(239,68,68,0.3); }
  .submit-btn.admin-mode:hover:not(:disabled) { box-shadow: 0 8px 28px rgba(239,68,68,0.4); }

  .msg {
    margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 10px;
    font-size: 0.875rem; font-weight: 500; text-align: center;
  }
  .msg.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .msg.success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }

  .back-link { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: #475569; }
  .back-link a { color: #6366f1; text-decoration: none; font-weight: 600; }
  .back-link a:hover { text-decoration: underline; }
`;

export default function CreateUser() {
  const [roleId, setRoleId] = useState(2);
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '',
    aadhar: '', password: '', dob: '', company: ''
  });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('error');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!document.getElementById('cu-styles')) {
    const s = document.createElement('style');
    s.id = 'cu-styles';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/create-user', { ...form, roleId });
      setMsgType('success');
      setMessage(res.data.message + ' Redirecting to login…');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMsgType('error');
      setMessage(err.response?.data?.message || 'Failed to create account');
    }
    setLoading(false);
  };

  const isAdmin = roleId === 1;

  return (
    <div className="cu-root">
      <div className="cu-card">
        <div className="cu-header">
          <div className="cu-header-icon">✨</div>
          <h2>Create Account</h2>
          <p>Register a new employee or admin</p>
        </div>

        <div className="role-tabs">
          <button className={`rtab ${!isAdmin ? 'active' : ''}`} type="button" onClick={() => setRoleId(2)}>
            👤 Employee
          </button>
          <button className={`rtab ${isAdmin ? 'active active-admin' : ''}`} type="button" onClick={() => setRoleId(1)}>
            🛡️ Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="cu-field">
              <label>First Name *</label>
              <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" required />
            </div>
            <div className="cu-field">
              <label>Last Name *</label>
              <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" required />
            </div>
            <div className="cu-field">
              <label>Username *</label>
              <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="johndoe" required />
            </div>
            <div className="cu-field">
              <label>Email {isAdmin ? '*' : '(Optional)'}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="john@company.com"
                required={isAdmin}
              />
            </div>

            {!isAdmin && (
              <div className="cu-field">
                <label>Aadhar Number * (12 digits)</label>
                <input
                  value={form.aadhar}
                  onChange={e => set('aadhar', e.target.value)}
                  placeholder="123456789012"
                  maxLength={12}
                  required
                />
              </div>
            )}

            <div className="cu-field">
              <label>Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="cu-field">
              <label>Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
            </div>
            <div className="cu-field">
              <label>Company</label>
              <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isAdmin ? 'admin-mode' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating…' : isAdmin ? '🛡️ Create Admin' : '👤 Create Employee'}
          </button>
        </form>

        {message && <div className={`msg ${msgType}`}>{message}</div>}

        <p className="back-link">
          Already have an account? <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
}