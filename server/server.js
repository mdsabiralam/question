require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exam-builder')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Exam Builder API is running');
});

// Import Question Model (just to verify it loads)
const Question = require('./models/Question');
const { upload } = require('./config/cloudinary');

app.post('/api/questions', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cloud Sync Upload API
app.post('/api/sync-cloud', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the Cloudinary URL
    res.json({
        message: 'File uploaded successfully',
        url: req.file.path,
        public_id: req.file.filename
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
