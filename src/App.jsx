import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // landing, student-auth, admin-auth, student-dash, admin-dash
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [webinars, setWebinars] = useState([]);

  const API = "http://localhost:8080/api";

  // --- AUTH LOGIC ---
  const handleAuth = async (e, portalRole) => {
    e.preventDefault();
    try {
      const path = isLogin ? "/auth/login" : "/auth/signup";
      // We force the role based on which portal they clicked
      const res = await axios.post(`${API}${path}`, { ...form, role: portalRole });

      if (isLogin) {
        // Double check the role from the server matches the portal
        if (res.data.role.toUpperCase() !== portalRole) {
          alert(`Access Denied! You are trying to log into the ${portalRole} portal with a ${res.data.role} account.`);
          return;
        }
        setUser(res.data);
        setView(portalRole === 'ADMIN' ? 'admin-dash' : 'student-dash');
      } else {
        alert(`${portalRole} Account Created! Please Login.`);
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: Connection failed or invalid details.");
    }
  };

  const loadWebinars = () => {
    axios.get(`${API}/webinars`).then(res => setWebinars(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (user) loadWebinars();
  }, [user]);

  // --- 1. LANDING PAGE ---
  if (view === 'landing') {
    return (
      <div className="landing-screen">
        <h1 style={{color: 'var(--navy)', marginBottom: '40px'}}>Educational Webinar Platform</h1>
        <div className="choice-grid">
          <div className="portal-card student" onClick={() => {setView('student-auth'); setIsLogin(true);}}>
            <h2>Student Portal</h2>
            <p>Access Workshops & Replays</p>
            <button className="btn btn-navy">Enter Student Area</button>
          </div>
          <div className="portal-card admin" onClick={() => {setView('admin-auth'); setIsLogin(true);}}>
            <h2>Admin Portal</h2>
            <p>Management & Live Streaming</p>
            <button className="btn btn-navy" style={{background: 'white', color: 'var(--navy)'}}>Enter Admin Area</button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. STUDENT AUTH ---
  if (view === 'student-auth') {
    return (
      <div className="auth-bg">
        <div className="auth-box" style={{borderTop: '8px solid var(--pink)'}}>
          <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
          <h2 style={{color: 'var(--pink)'}}>{isLogin ? "Student Login" : "Student Register"}</h2>
          <form onSubmit={(e) => handleAuth(e, 'USER')}>
            <input type="email" placeholder="Student Email" required onChange={e => setForm({...form, email: e.target.value})} />
            <input type="password" placeholder="Password" required onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit" className="btn btn-pink" style={{width:'100%', marginTop:'10px'}}>{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p className="toggle" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "New Student? Join here" : "Have account? Login"}</p>
        </div>
      </div>
    );
  }

  // --- 3. ADMIN AUTH ---
  if (view === 'admin-auth') {
    return (
      <div className="auth-bg">
        <div className="auth-box" style={{borderTop: '8px solid var(--navy)'}}>
          <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
          <h2 style={{color: 'var(--navy)'}}>{isLogin ? "Admin Login" : "Admin Register"}</h2>
          <form onSubmit={(e) => handleAuth(e, 'ADMIN')}>
            <input type="email" placeholder="Admin Email" required onChange={e => setForm({...form, email: e.target.value})} />
            <input type="password" placeholder="Password" required onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit" className="btn btn-navy" style={{width:'100%', marginTop:'10px'}}>{isLogin ? "Login" : "Register"}</button>
          </form>
          <p className="toggle" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Need Admin Access? Register" : "Have Admin credentials? Login"}</p>
        </div>
      </div>
    );
  }

  // --- 4. STUDENT DASHBOARD ---
  if (view === 'student-dash') {
    return (
      <div>
        <nav className="navbar pink-nav">
          <span>STUDENT: {user.email}</span>
          <button onClick={() => {setUser(null); setView('landing');}} className="btn btn-navy">Logout</button>
        </nav>
        <div className="container">
          <h2 style={{color: 'var(--pink)'}}>Available Workshops</h2>
          {webinars.map(w => (
            <div key={w.id} className="card" style={{borderLeft: '10px solid var(--aqua)'}}>
              <h3>{w.title}</h3>
              {w.recordingUrl ? <button className="btn btn-navy" onClick={() => window.open(w.recordingUrl)}>Watch Replay ▶️</button> : <p>Live stream coming soon...</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 5. ADMIN DASHBOARD ---
  if (view === 'admin-dash') {
    return (
      <div>
        <nav className="navbar navy-nav">
          <span>ADMIN CONSOLE | {user.email}</span>
          <button onClick={() => {setUser(null); setView('landing');}} className="btn btn-pink">Logout</button>
        </nav>
        <div className="container">
          <div className="card" style={{borderLeft: '10px solid var(--orange)'}}>
            <h3>Schedule Live Webinar</h3>
            <input type="text" placeholder="Webinar Title" id="wtitle" />
            <button className="btn btn-navy" onClick={() => {
              const t = document.getElementById("wtitle").value;
              axios.post(`${API}/webinars`, {title: t}).then(() => {alert("Scheduled!"); loadWebinars();});
            }}>Post Webinar</button>
          </div>
          <h2>Live Management</h2>
          {webinars.map(w => (
            <div key={w.id} className="card">
              <h4>{w.title}</h4>
              <button className="btn btn-orange" onClick={() => {
                const url = prompt("Enter Recording URL:");
                if(url) axios.post(`${API}/webinars/${w.id}/record`, {url}).then(loadWebinars);
              }}>End & Upload Recording 📤</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;