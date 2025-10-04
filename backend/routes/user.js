// backend/routes/user.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserProfile, updateStreak } = require('../controllers/userController');

// @route    GET api/user/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, getUserProfile);

// @route    PUT api/user/streak
// @desc     Update user's study streak
// @access   Private
router.put('/streak', auth, updateStreak);

module.exports = router;