// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows parsing of JSON in request body


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


// --- API Routes will go here ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); 
app.use('/api/questions', require('./routes/question'));


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});