import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Vote from '../components/Vote';
import './SingleQuestionPage.css';

const SingleQuestionPage = () => {
    const { id } = useParams();
    const { isAnonymous } = useContext(AuthContext);
    const [question, setQuestion] = useState(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isReported, setIsReported] = useState(false);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { 'x-auth-token': localStorage.getItem('token') }
    });

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user.id;
        }
        return null;
    };

    const fetchQuestion = async () => {
        try {
            const res = await api.get(`/questions/${id}`);
            setQuestion(res.data);
            
            const currentUser = getUserId();
            const reported = res.data.reports.some(r => r.user === currentUser);
            setIsReported(reported);

        } catch (err) {
            console.error('Error fetching question:', err);
            setError('Could not load the question.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setUserId(getUserId());
        fetchQuestion();
    }, [id]);

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { text: newAnswerText, isAnonymous };
            await api.post(`/questions/${id}/answers`, body);
            setNewAnswerText('');
            fetchQuestion();
        } catch (err) {
            console.error('Error posting answer:', err);
            setError('Failed to post answer.');
        }
    };

    const handleReportQuestion = async () => {
        if (window.confirm('Are you sure you want to report this question?')) {
            try {
                await api.put(`/questions/${id}/report`);
                setIsReported(true);
                alert('Question has been reported.');
            } catch (err) {
                console.error('Error reporting question:', err);
                alert(err.response?.data?.msg || 'Failed to report question.');
            }
        }
    };

    const handleVote = async (target, targetId, vote) => {
        try {
            const url = target === 'question'
                ? `/questions/${targetId}/vote`
                : `/questions/${id}/answers/${targetId}/vote`;
            
            const res = await api.put(url, { vote });
            setQuestion(res.data);
        } catch (err) {
            console.error(`Error voting on ${target}:`, err);
        }
    };

    const findUserVote = (votesArray) => {
        const userVote = votesArray.find(v => v.user === userId);
        return userVote ? userVote.vote : 0;
    };

    if (loading) return <p>Loading question...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="single-q-container">
            <Link to="/qna" className="back-link">← Back to All Questions</Link>
            
            {question && (
                <>
                    <div className="question-detail-item">
                        <Vote 
                            score={question.voteScore}
                            userVote={findUserVote(question.votes)}
                            onVote={(vote) => handleVote('question', question._id, vote)}
                        />
                        <div className="question-content">
                            <p className="question-detail-text">{question.text}</p>
                            <div className="question-meta">
                                <small className="question-detail-author">
                                    Asked by {question.authorName} on {new Date(question.createdAt).toLocaleDateString()}
                                </small>
                                <button 
                                    onClick={handleReportQuestion} 
                                    className="report-btn"
                                    disabled={isReported}
                                >
                                    {isReported ? 'Reported' : '🚩 Report'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="answer-section">
                        <h3>{question.answers.length} Answers</h3>
                        <form onSubmit={handleAnswerSubmit} className="answer-form">
                            <textarea
                                value={newAnswerText}
                                onChange={(e) => setNewAnswerText(e.target.value)}
                                placeholder="Write your answer..."
                                rows="4"
                            ></textarea>
                            <button type="submit">Post Answer</button>
                        </form>

                        <div className="answer-list">
                            {question.answers && question.answers.length > 0 ? (
                                question.answers.map((ans) => (
                                    <div key={ans._id} className="answer-item">
                                        <Vote 
                                            score={ans.voteScore}
                                            userVote={findUserVote(ans.votes)}
                                            onVote={(vote) => handleVote('answer', ans._id, vote)}
                                        />
                                        <div className="answer-content">
                                            <p className="answer-text">{ans.text}</p>
                                            <small className="answer-author">
                                                Answered by {ans.authorName} on {new Date(ans.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No answers yet. Be the first to help!</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SingleQuestionPage;