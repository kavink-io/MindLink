const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A schema for individual votes
const VoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    vote: { type: Number, required: true, enum: [1, -1] } // 1 for upvote, -1 for downvote
});

const AnswerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    votes: [VoteSchema],
}, { 
    timestamps: true,
    toJSON: { virtuals: true }, // Important: ensures virtual fields are included in JSON responses
    toObject: { virtuals: true } 
});

// Create a virtual property to calculate the vote score
AnswerSchema.virtual('voteScore').get(function() {
    return this.votes.reduce((total, v) => total + v.vote, 0);
});

const QuestionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    answers: [AnswerSchema],
    votes: [VoteSchema],
    reports: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
}, { 
    timestamps: true,
    toJSON: { virtuals: true }, // Make sure virtuals are included for questions too
    toObject: { virtuals: true } 
});

QuestionSchema.virtual('voteScore').get(function() {
    return this.votes.reduce((total, v) => total + v.vote, 0);
});

module.exports = mongoose.model('Question', QuestionSchema);