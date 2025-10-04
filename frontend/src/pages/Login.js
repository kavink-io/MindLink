// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css'; // Import the new CSS file

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); // Save the token
            navigate('/qna'); // Redirect to the Q&A room
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Welcome Back!</h2>
            <form onSubmit={onSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={onChange} required />
                        <span className="password-icon" onClick={toggleShowPassword}>
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </div>
                </div>
                <button type="submit">Login</button>
            </form>
            <p className="form-link">
                Don't have an account? <Link to="/register">Register now</Link>
            </p>
        </div>
    );
};

export default Login;