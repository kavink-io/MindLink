const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    postQuestion, 
    getAllQuestions,
    getQuestionById,
    postAnswer,
    voteOnQuestion,
    voteOnAnswer,
    reportQuestion
} = require('../controllers/questionController');

// @route    POST api/questions
// @desc     Create a question
// @access   Private
router.post('/', auth, postQuestion);

// @route    GET api/questions
// @desc     Get all questions
// @access   Private
router.get('/', auth, getAllQuestions);

// @route    GET api/questions/:id
// @desc     Get a single question by ID
// @access   Private
router.get('/:id', auth, getQuestionById);

// @route    POST api/questions/:id/answers
// @desc     Post an answer to a question
// @access   Private
router.post('/:id/answers', auth, postAnswer);

// @route    PUT api/questions/:id/vote
// @desc     Vote on a question
// @access   Private
router.put('/:id/vote', auth, voteOnQuestion);

// @route    PUT api/questions/:questionId/answers/:answerId/vote
// @desc     Vote on an answer
// @access   Private
router.put('/:questionId/answers/:answerId/vote', auth, voteOnAnswer);

// @route    PUT api/questions/:id/report
// @desc     Report a question
// @access   Private
router.put('/:id/report', auth, reportQuestion);

module.exports = router;