// src/components/Vote.js

import React from 'react';
import './Vote.css'; // We'll create this next

const Vote = ({ score, onVote, userVote }) => {
    return (
        <div className="vote-widget">
            <button 
                className={`vote-btn upvote ${userVote === 1 ? 'active' : ''}`} 
                onClick={() => onVote(1)}
            >
                ▲
            </button>
            <span className="vote-score">{score}</span>
            <button 
                className={`vote-btn downvote ${userVote === -1 ? 'active' : ''}`} 
                onClick={() => onVote(-1)}
            >
                ▼
            </button>
        </div>
    );
};

export default Vote;