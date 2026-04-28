import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "http://localhost:8080/api";

export default function App() {
  const [view, setView] = useState('landing'); // landing, auth, dashboard
  const [role, setRole] = useState(''); // ADMIN or USER
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [webinars, setWebinars] = useState([]);

  // Form States
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '', phoneNumber: '', education: '', qualification: '' });
  const [newWebinar, setNewWebinar] = useState({ title: '', dateTime: '', meetingLink: '' });
  const [editLinks, setEditLinks] = useState({});

  const loadData = () => axios.get(`${API}/webinars`).then(res => setWebinars(res.data));

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin ? { email: authForm.email, password: authForm.password } : { ...authForm, role };
      const res = await axios.post(`${API}${endpoint}`, payload);

      if (isLogin) {
        if (res.data.role.toUpperCase() !== role) return alert("Access Denied: Wrong Portal!");
        setUser(res.data);
        setView('dashboard');
        loadData();
      } else {
        alert("Account Created! Please Login.");
        setIsLogin(true);
      }
    } catch (err) { alert("Invalid Credentials or Connection Failed."); }
  };

  // CRUD Operations
  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/webinars`, newWebinar);
    setNewWebinar({ title: '', dateTime: '', meetingLink: '' });
    loadData();
  };

  const handleUpdate = async (id) => {
    const link = editLinks[id];
    if (link) {
      await axios.post(`${API}/webinars/${id}/record`, { url: link });
      alert("Recorded Link Updated!");
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete Workshop?")) {
      await axios.delete(`${API}/webinars/${id}`);
      loadData();
    }
  };

  // --- 1. LANDING SCREEN ---
  if (view === 'landing') return (
    <div className="auth-bg">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '50px', color: 'var(--accent-gold)' }}>Webinar Workshop</h1>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn-gold" style={{ padding: '20px 40px' }} onClick={() => { setRole('USER'); setView('auth'); }}>Student Portal</button>
          <button className="btn-gold" style={{ padding: '20px 40px', background: 'white' }} onClick={() => { setRole('ADMIN'); setView('auth'); }}>Admin Portal</button>
        </div>
      </div>
    </div>
  );

  // --- 2. AUTH SCREEN (LOGIN/REGISTER) ---
  if (view === 'auth') return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>{role} {isLogin ? 'Login' : 'Registration'}</h2>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email Address" onChange={e => setAuthForm({ ...authForm, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required />
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" onChange={e => setAuthForm({ ...authForm, fullName: e.target.value })} required />
              <input type="text" placeholder="Phone Number" onChange={e => setAuthForm({ ...authForm, phoneNumber: e.target.value })} required />
              <input type="text" placeholder="Education" onChange={e => setAuthForm({ ...authForm, education: e.target.value })} />
              {role === 'ADMIN' && <input type="text" placeholder="Admin Qualification" onChange={e => setAuthForm({ ...authForm, qualification: e.target.value })} />}
            </>
          )}
          <button type="submit" className="btn-gold" style={{ width: '100%' }}>{isLogin ? 'Login' : 'Create Profile'}</button>
        </form>
        <p style={{ textAlign: 'center', cursor: 'pointer', marginTop: '20px', color: '#888' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "No account? Register here" : "Back to Login"}
        </p>
        <p style={{ textAlign: 'center', cursor: 'pointer', fontSize: '12px' }} onClick={() => setView('landing')}>← Back to Portals</p>
      </div>
    </div>
  );

  // --- 3. DASHBOARD SCREEN ---
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">Webinar Workshop</div>
        <div className="user-info-card">
          <div className="initials-box">{user.fullName.substring(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{user.fullName}</div>
            <div style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>{user.role}</div>
          </div>
        </div>
        <div className="profile-details">
          <span>EMAIL: <b>{user.email}</b></span>
          <span>PHONE: <b>{user.phoneNumber}</b></span>
          <span>EDU: <b>{user.education}</b></span>
          {user.role === 'ADMIN' && <span>QUAL: <b>{user.qualification}</b></span>}
        </div>
        <button style={{ marginTop: 'auto', background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setView('landing')}>Logout</button>
      </aside>

      {/* CONTENT */}
      <main className="main-area">
        <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>Workshop Overview</h1>

        <div className="stats-grid">
          <div className="stat-card"><div>TOTAL WORKSHOPS</div><div className="stat-value">{webinars.length}</div></div>
          <div className="stat-card"><div>ACTIVE LIVE</div><div className="stat-value">{webinars.filter(w => w.live).length}</div></div>
        </div>

        {user.role === 'ADMIN' ? (
          <>
            <div className="content-card" style={{ marginBottom: '20px' }}>
              <h3>Add New Workshop</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Title" value={newWebinar.title} onChange={e => setNewWebinar({ ...newWebinar, title: e.target.value })} />
                <input type="datetime-local" value={newWebinar.dateTime} onChange={e => setNewWebinar({ ...newWebinar, dateTime: e.target.value })} />
                <input placeholder="Live Link" value={newWebinar.meetingLink} onChange={e => setNewWebinar({ ...newWebinar, meetingLink: e.target.value })} />
                <button className="btn-gold" onClick={handleAdd}>Add</button>
              </div>
            </div>
            <div className="content-card">
              <table className="data-table">
                <thead><tr><th>TITLE</th><th>STATUS</th><th>REC LINK</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {webinars.map(w => (
                    <tr key={w.id}>
                      <td><b>{w.title}</b></td>
                      <td className={w.live ? 'status-live' : 'status-recorded'}>{w.live ? "● LIVE" : "RECORDED"}</td>
                      <td><input style={{ margin: 0, padding: '5px' }} placeholder="Paste Rec URL" defaultValue={w.recordingUrl} onChange={e => setEditLinks({ ...editLinks, [w.id]: e.target.value })} /></td>
                      <td>
                        <button className="btn-gold" style={{ padding: '5px 10px', marginRight: '5px' }} onClick={() => handleUpdate(w.id)}>Update</button>
                        <button style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(w.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="student-grid">
            {webinars.map(w => (
              <div key={w.id} className="stat-card" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0 }}>{w.title}</h3>
                <p style={{ fontSize: '12px', color: '#777' }}>{new Date(w.dateTime).toLocaleString()}</p>
                <div style={{ marginTop: '20px' }}>
                  <a href={w.live ? w.meetingLink : w.recordingUrl} target="_blank" rel="noreferrer" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    {w.live ? "Join Live Session" : "Watch Recorded Session"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}