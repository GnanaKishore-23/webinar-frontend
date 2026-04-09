import { useEffect, useState } from 'react';
import { getWebinars, registerUser } from '../services/api';

export default function UserDashboard() {
    const [webinars, setWebinars] = useState([]);

    useEffect(() => {
        loadWebinars();
    }, []);

    const loadWebinars = async () => {
        const res = await getWebinars();
        setWebinars(res.data);
    };

    const handleRegister = async (webinarId) => {
        const userEmail = prompt("Enter your email to register:");
        if(userEmail) {
            await registerUser({ webinarId, userEmail, userName: "Test User" });
            alert("Registered successfully!");
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h2>Available Webinars</h2>
            {webinars.map(w => (
                <div key={w.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
                    <h3>{w.title}</h3>
                    <p>{w.description}</p>
                    <p>Date: {new Date(w.dateTime).toLocaleString()}</p>
                    <button onClick={() => handleRegister(w.id)}>Register</button>
                    {w.recordingUrl && (
                        <div>
                            <a href={w.recordingUrl} target="_blank">Watch Recording</a> | 
                            <a href={w.resourceMaterial} target="_blank"> Resources</a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}