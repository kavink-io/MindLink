const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Post a new question
// @route   POST /api/questions
exports.postQuestion = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        const newQuestion = new Question({
            text: req.body.text,
            authorName: req.body.isAnonymous ? 'Anonymous Panda' : user.name,
            user: req.user.id,
        });

        const question = await newQuestion.save();
        res.status(201).json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all questions
// @route   GET /api/questions
exports.getAllQuestions = async (req, res) => {
    try {
        const { sortBy } = req.query; // Get sortBy from query params (e.g., ?sortBy=votes)

        let questions;

        if (sortBy === 'votes') {
            // Use an Aggregation Pipeline to calculate score and sort
            questions = await Question.aggregate([
                {
                    $addFields: {
                        // Create a new field 'voteScore' by summing the votes array
                        voteScore: { $sum: "$votes.vote" } 
                    }
                },
                { $sort: { voteScore: -1 } } // Sort by the new field, descending
            ]);
        } else {
            // Default sort by most recent
            questions = await Question.find().sort({ createdAt: -1 });
        }
        
        res.json(questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single question by its ID
// @route   GET /api/questions/:id
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ msg: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Post an answer to a question
// @route   POST /api/questions/:id/answers
exports.postAnswer = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const question = await Question.findById(req.params.id);

        const newAnswer = {
            text: req.body.text,
            authorName: req.body.isAnonymous ? 'Anonymous Panda' : user.name,
            user: req.user.id,
        };

        question.answers.unshift(newAnswer);
        await question.save();
        res.status(201).json(question.answers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// A generic function to handle vote logic
const handleVote = (doc, userId, voteValue) => {
    const existingVote = doc.votes.find(v => v.user.equals(userId));

    if (existingVote) {
        if (existingVote.vote === voteValue) {
            doc.votes = doc.votes.filter(v => !v.user.equals(userId));
        } else {
            existingVote.vote = voteValue;
        }
    } else {
        doc.votes.push({ user: userId, vote: voteValue });
    }
};

// @desc    Vote on a question
// @route   PUT /api/questions/:id/vote
exports.voteOnQuestion = async (req, res) => {
    const { vote } = req.body;
    try {
        const question = await Question.findById(req.params.id);
        handleVote(question, req.user.id, vote);
        await question.save();
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Vote on an answer
// @route   PUT /api/questions/:questionId/answers/:answerId/vote
exports.voteOnAnswer = async (req, res) => {
    const { vote } = req.body;
    try {
        const question = await Question.findById(req.params.questionId);
        const answer = question.answers.id(req.params.answerId);
        
        handleVote(answer, req.user.id, vote);
        
        await question.save();
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Report a question
// @route   PUT /api/questions/:id/report
exports.reportQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        const alreadyReported = question.reports.some(
            report => report.user.equals(req.user.id)
        );

        if (alreadyReported) {
            return res.status(400).json({ msg: 'You have already reported this question.' });
        }

        question.reports.unshift({ user: req.user.id });

        await question.save();
        res.json({ msg: 'Question reported successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};