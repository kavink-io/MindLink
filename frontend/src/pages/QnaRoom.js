import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './QnaRoom.css';

const QnaRoom = () => {
    const { isAnonymous } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { 
                headers: { 'x-auth-token': token },
                params: { sortBy }
            };
            const res = await axios.get('http://localhost:5000/api/questions', config);
            setQuestions(res.data);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Could not load questions.');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [sortBy]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newQuestionText.trim()) {
            setError('Question cannot be empty.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const body = { text: newQuestionText, isAnonymous };
            await axios.post('http://localhost:5000/api/questions', body, config);
            setNewQuestionText('');
            setError('');
            if (sortBy !== 'recent') {
                setSortBy('recent');
            } else {
                fetchQuestions();
            }
        } catch (err) {
            console.error('Error posting question:', err);
            setError('Failed to post question. Please try again.');
        }
    };

    return (
        <div className="qna-container">
            <h1 className="qna-title">Q&A Doubt Room</h1>
            <form onSubmit={handleSubmit} className="qna-form">
                <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Ask a question..."
                    rows="3"
                ></textarea>
                <button type="submit">Post Question</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            
            <div className="question-list-header">
                <h2>All Questions</h2>
                <div className="sort-controls">
                    <button 
                        className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                        onClick={() => setSortBy('recent')}
                    >
                        Most Recent
                    </button>
                    <button 
                        className={`sort-btn ${sortBy === 'votes' ? 'active' : ''}`}
                        onClick={() => setSortBy('votes')}
                    >
                        Top Voted
                    </button>
                </div>
            </div>
            
            <div className="question-list">
                {questions.length > 0 ? (
                    questions.map((q) => (
                        <Link to={`/question/${q._id}`} key={q._id} className="question-link-item">
                            <div className="question-item">
                                <p className="question-text">{q.text}</p>
                                <small className="question-author">
                                    Asked by {q.authorName} on {new Date(q.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No questions yet. Be the first to ask!</p>
                )}
            </div>
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
    );
};

export default QnaRoom;