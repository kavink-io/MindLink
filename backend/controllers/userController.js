// backend/controllers/userController.js

const User = require('../models/User');

// Helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

// Helper function to check if a date was yesterday
const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
};

// @desc    Get current user's data
// @route   GET /api/user/me
exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id is coming from the authMiddleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update study streak after a completed session
// @route   PUT /api/user/streak
exports.updateStreak = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const today = new Date();
        
        if (user.lastStudyDate) {
            if (isSameDay(user.lastStudyDate, today)) {
                // Already studied today, do nothing
                return res.json({ studyStreak: user.studyStreak });
            }
            if (isYesterday(user.lastStudyDate)) {
                // Continued the streak
                user.studyStreak += 1;
            } else {
                // Broke the streak
                user.studyStreak = 1;
            }
        } else {
            // First time studying
            user.studyStreak = 1;
        }
        
        user.lastStudyDate = today;
        await user.save();
        
        res.json({ studyStreak: user.studyStreak });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};