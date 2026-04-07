// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import CreateUser from './CreateUser';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;