// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import StudyStreak from './components/StudyStreak'; // <-- 1. IMPORT
import Register from './pages/Register';
import Login from './pages/Login';
import QnaRoom from './pages/QnaRoom';
import SingleQuestionPage from './pages/SingleQuestionPage';
import RelaxRoom from './pages/RelaxRoom';
import TimerPage from './pages/TimerPage';
import './App.css';

const PrivateRoutes = () => {
    const token = localStorage.getItem('token');
    return token ? (
        <>
            <Navbar />
            <StudyStreak /> {/* <-- 2. ADD COMPONENT HERE */}
            <main className="main-content">
                <Outlet />
            </main>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/" element={<Navigate to="/qna" />} />
                        <Route path="/qna" element={<QnaRoom />} />
                        <Route path="/question/:id" element={<SingleQuestionPage />} />
                        <Route path="/timer" element={<TimerPage />} />
                        <Route path="/relax" element={<RelaxRoom />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;