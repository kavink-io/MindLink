import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnonymousToggle from './AnonymousToggle';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/qna" className="navbar-logo">
                    MindLink
                </NavLink>

                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    &#9776; {/* Hamburger Icon */}
                </div>

                <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <NavLink to="/qna" className="nav-item" onClick={() => setMenuOpen(false)}>Q&A Room</NavLink>
                    <NavLink to="/timer" className="nav-item" onClick={() => setMenuOpen(false)}>Timer</NavLink>
                    <NavLink to="/relax" className="nav-item" onClick={() => setMenuOpen(false)}>Relax Room</NavLink>
                    <div className="nav-item nav-component">
                        <AnonymousToggle />
                    </div>
                    <div className="nav-item">
                        <button onClick={toggleTheme} className="theme-toggle-btn">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;