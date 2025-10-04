// src/pages/RelaxRoom.js

import React from 'react';
import { Link } from 'react-router-dom';
import './RelaxRoom.css'; // We will create this next

const RelaxRoom = () => {
    return (
        <div className="relax-room-container">
            <h1 className="relax-title">Welcome to the Relax Room</h1>
            <p className="relax-subtitle">
                Take a deep breath and enjoy a moment of calm.
            </p>

            <div className="video-container">
                {/* This is a standard YouTube embed code */}
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/jfKfPfyJRdk" // A popular lofi hip hop stream
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <Link to="/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>
        </div>
    );
};

export default RelaxRoom;