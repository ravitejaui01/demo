// src/Login.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Outfit', sans-serif;
    background: #060912;
    color: #e2e8f0;
    min-height: 100vh;
  }

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background:
      radial-gradient(ellipse 80% 50% at 10% 60%, rgba(14,165,233,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 30%, rgba(99,102,241,0.07) 0%, transparent 60%),
      #060912;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background: rgba(15,20,35,0.95);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset;
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .brand {
    text-align: center;
    margin-bottom: 2rem;
  }

  .brand-icon {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #6366f1, #0ea5e9);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  }

  .brand h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #e2e8f0, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand p {
    color: #64748b;
    font-size: 0.875rem;
    margin-top: 0.3rem;
  }

  .role-selector {
    display: flex;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 1.5rem;
    gap: 4px;
  }

  .role-btn {
    flex: 1;
    padding: 0.6rem;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s;
    background: transparent;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  .role-btn.active {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.35);
  }

  .role-btn.active-admin {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 12px rgba(239,68,68,0.35);
  }

  .field {
    margin-bottom: 1rem;
  }

  .field label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
  }

  .field input {
    width: 100%;
    padding: 0.8rem 1rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #e2e8f0;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .field input::placeholder { color: #334155; }

  .login-btn {
    width: 100%;
    padding: 0.9rem;
    border: none;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.45);
  }

  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .login-btn.admin-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 20px rgba(239,68,68,0.3);
  }

  .login-btn.admin-btn:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(239,68,68,0.45);
  }

  .msg {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
  }

  .msg.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .msg.success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }

  .create-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #475569;
  }

  .create-link a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
  }

  .create-link a:hover { text-decoration: underline; }
`;

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '', roleId: 2 });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('error');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inject styles
  if (!document.getElementById('login-styles')) {
    const s = document.createElement('style');
    s.id = 'login-styles';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  const selectRole = (id) => setForm(f => ({ ...f, roleId: id }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/login', {
        username: form.username,
        password: form.password,
        roleId: form.roleId
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('roleId', String(res.data.roleId));
      localStorage.setItem('username', res.data.username);

      setMsgType('success');
      setMessage(`Welcome back, ${res.data.firstName} ${res.data.lastName}!`);

      setTimeout(() => {
        navigate(res.data.roleId === 1 ? '/admin-dashboard' : '/user-dashboard');
      }, 800);
    } catch (err) {
      setMsgType('error');
      setMessage(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = form.roleId === 1;

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">🏢</div>
          <h1>EmployeePortal</h1>
          <p>Secure staff management system</p>
        </div>

        <div className="role-selector">
          <button
            className={`role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => selectRole(2)}
            type="button"
          >
            👤 Employee
          </button>
          <button
            className={`role-btn ${isAdmin ? 'active active-admin' : ''}`}
            onClick={() => selectRole(1)}
            type="button"
          >
            🛡️ Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <button
            type="submit"
            className={`login-btn ${isAdmin ? 'admin-btn' : ''}`}
            disabled={loading}
          >
            {loading
              ? 'Signing in…'
              : isAdmin ? '🛡️ Sign in as Admin' : '👤 Sign in as Employee'
            }
          </button>
        </form>

        {message && <div className={`msg ${msgType}`}>{message}</div>}

        <p className="create-link">
          New here?{' '}
          <a href="/create-user">Create an account</a>
        </p>
      </div>
    </div>
  );
}