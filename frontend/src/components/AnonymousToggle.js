// src/components/AnonymousToggle.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AnonymousToggle.css'; // We will create this next

const AnonymousToggle = () => {
    const { isAnonymous, toggleAnonymousMode } = useContext(AuthContext);

    return (
        <div className="toggle-container">
            <span>Anonymous Mode</span>
            <label className="switch">
                <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={toggleAnonymousMode} 
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default AnonymousToggle;