// src/pages/TimerPage.js

import React from 'react';
import FocusTimer from '../components/FocusTimer';
import './TimerPage.css';

const TimerPage = () => {
    return (
        <div className="timer-page-container">
            <div className="timer-page-header">
                <h1>Focus Mode</h1>
                <p>Minimize distractions and get to work.</p>
            </div>
            <FocusTimer />
        </div>
    );
};

export default TimerPage;