import { useState } from 'react';
import { createWebinar, updateResources } from '../services/api';

export default function AdminPanel() {
    const [form, setForm] = useState({ title: '', description: '', dateTime: '', meetingLink: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createWebinar(form);
        alert("Webinar Scheduled!");
    };

    return (
        <div style={{padding: '20px'}}>
            <h2>Admin: Schedule Webinar</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} required /><br/>
                <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} /><br/>
                <input type="datetime-local" onChange={e => setForm({...form, dateTime: e.target.value})} /><br/>
                <input type="text" placeholder="Meeting Link" onChange={e => setForm({...form, meetingLink: e.target.value})} /><br/>
                <button type="submit">Schedule</button>
            </form>
        </div>
    );
}