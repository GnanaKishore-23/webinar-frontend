import React, { useState, useEffect } from 'react';
import { webinarAPI } from '../services/api';

export default function AdminPanel() {
    const [webinars, setWebinars] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', dateTime: '', meetingLink: '' });
    const [recordingUrls, setRecordingUrls] = useState({});

    const loadData = () => webinarAPI.getAll().then(res => setWebinars(res.data));
    useEffect(() => { loadData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await webinarAPI.create(form);
        alert("Webinar Created!");
        loadData();
    };

    const handleSaveRecording = async (id) => {
        const url = recordingUrls[id];
        if(!url) return alert("Enter a URL");
        await webinarAPI.saveRecording(id, url);
        alert("Recording Saved!");
        loadData();
    };

    return (
        <div className="admin-panel">
            <div className="card">
                <h2>Schedule New Webinar</h2>
                <form onSubmit={handleCreate}>
                    <input type="text" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} required />
                    <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
                    <input type="datetime-local" onChange={e => setForm({...form, dateTime: e.target.value})} required />
                    <input type="text" placeholder="Meeting Link" onChange={e => setForm({...form, meetingLink: e.target.value})} required />
                    <button type="submit" className="btn btn-navy">Post Webinar</button>
                </form>
            </div>

            <h2>Manage Existing Webinars</h2>
            {webinars.map(w => (
                <div key={w.id} className="card">
                    <h4>{w.title}</h4>
                    <p>Status: {w.live ? "🔴 LIVE" : "📁 RECORDED"}</p>
                    <div style={{display:'flex', gap:'10px'}}>
                        <input 
                            placeholder="Paste Recording URL" 
                            style={{margin:0}}
                            onChange={(e) => setRecordingUrls({...recordingUrls, [w.id]: e.target.value})} 
                        />
                        <button className="btn btn-navy" onClick={() => handleSaveRecording(w.id)}>Upload Link</button>
                        <button className="btn-del" onClick={async () => { await webinarAPI.delete(w.id); loadData(); }}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}