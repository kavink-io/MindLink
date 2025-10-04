import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FocusTimer.css';

const FocusTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    // Function to call the streak API
    const handleSessionComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { 'x-auth-token': token } };
            await axios.put('http://localhost:5000/api/user/streak', null, config);
            console.log("Streak updated!");
            // You could optionally trigger a UI update here to show the new streak immediately.
        } catch (err) {
            console.error("Failed to update streak", err);
        }
    };

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Logic when timer finishes
                        if (!isBreak) { // Only update streak after a FOCUS session
                            handleSessionComplete();
                        }
                        setIsActive(false);
                        const nextIsBreak = !isBreak;
                        setIsBreak(nextIsBreak);
                        nextIsBreak ? setMinutes(5) : setMinutes(25);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, minutes, isBreak]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25); // Reset to default 25 minutes
        setSeconds(0);
    };

    const setTimerPreset = (mins) => {
        setIsActive(false); // Stop the timer if it's running
        setIsBreak(false);
        setMinutes(mins);
        setSeconds(0);
    };

    return (
        <div className="focus-timer-container">
            <h3>{isBreak ? 'Break Time' : 'Focus Time'}</h3>

            <div className="timer-display">
                <span>{String(minutes).padStart(2, '0')}</span>:
                <span>{String(seconds).padStart(2, '0')}</span>
            </div>

            <div className="timer-presets">
                <button onClick={() => setTimerPreset(15)} className="preset-button">
                    15 min
                </button>
                <button onClick={() => setTimerPreset(30)} className="preset-button">
                    30 min
                </button>
                <button onClick={() => setTimerPreset(60)} className="preset-button">
                    60 min
                </button>
            </div>

            <div className="timer-controls">
                <button onClick={toggleTimer} className="control-button">
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer} className="control-button reset-button">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default FocusTimer;