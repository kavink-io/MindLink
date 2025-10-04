import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudyStreak.css';

const StudyStreak = () => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = {
                    headers: { 'x-auth-token': token }
                };
                const res = await axios.get('http://localhost:5000/api/user/me', config);
                setStreak(res.data.studyStreak);
            } catch (err) {
                console.error("Could not fetch streak", err);
            }
        };

        fetchStreak();
    }, []);

    return (
        <div className="study-streak-container">
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{streak}</span>
            <span className="streak-label">Day Streak</span>
        </div>
    );
};

export default StudyStreak;