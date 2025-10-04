// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css'; // Import the new CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        try {
            const newUser = { name, email, password };
            await axios.post('http://localhost:5000/api/auth/register', newUser);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Create Your Account</h2>
            <form onSubmit={onSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
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
                <button type="submit">Register</button>
            </form>
            <p className="form-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;