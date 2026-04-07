import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', department: '', aadhar: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', form);
      alert('Registered! Now login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h2>User Registration</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: 10 }} />
      <input name="email" placeholder="Email" onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: 10 }} />
      <input name="department" placeholder="Department" onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: 10 }} />
      <input name="aadhar" placeholder="Aadhar Number (12 digits)" maxLength={12} onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: 10 }} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: 10 }} />
      <button onClick={handleRegister} style={{ width: '100%', padding: 12, background: '#007bff', color: 'white' }}>Register</button>
    </div>
  );
}