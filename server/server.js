require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exam-builder')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Models
const Question = require('./models/Question');
const ExamPaper = require('./models/ExamPaper');
const EventStore = require('./models/EventStore');
const { upload } = require('./config/cloudinary');

// Seed Data
const seedQuestions = [
  {
    title: 'What is the capital of Bangladesh?',
    subject: 'General Knowledge',
    type: 'MCQ',
    marks: 1,
    class: 'class-10',
    difficulty: 'Easy',
  },
  {
    title: 'Explain the theory of relativity.',
    subject: 'Science',
    type: 'Short Answer',
    marks: 5,
    class: 'class-10',
    difficulty: 'Hard',
  },
  {
    title: 'Solve for x: 2x + 5 = 15',
    subject: 'Math',
    type: 'Short Answer',
    marks: 3,
    class: 'class-10',
    difficulty: 'Medium',
  },
  {
    title: 'Write a poem about rain.',
    subject: 'Bengali',
    type: 'Creative',
    marks: 10,
    class: 'class-10',
    difficulty: 'Medium',
  },
  {
    title: 'Who wrote Gitanjali?',
    subject: 'Bengali',
    type: 'MCQ',
    marks: 1,
    class: 'class-10',
    difficulty: 'Easy',
  },
  {
    title: 'What is photosynthesis?',
    subject: 'Science',
    type: 'Short Answer',
    marks: 3,
    class: 'class-9',
    difficulty: 'Medium',
  },
  {
    title: 'Derive E=mc^2',
    subject: 'Science',
    type: 'Creative',
    marks: 10,
    class: 'class-10',
    difficulty: 'Hard',
  },
];

// Routes
app.get('/', (req, res) => {
  res.send('Exam Builder API is running');
});

// GET Questions (with seeding)
app.get('/api/questions', async (req, res) => {
    try {
        let questions = await Question.find();
        if (questions.length === 0) {
            console.log('Seeding questions...');
            await Question.insertMany(seedQuestions);
            questions = await Question.find();
        }
        const formattedQuestions = questions.map(q => ({
            ...q.toObject(),
            id: q._id.toString()
        }));
        res.json(formattedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/questions', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json({ ...question.toObject(), id: question._id.toString() });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST Exam Paper (Save Draft)
app.post('/api/exam-paper', async (req, res) => {
    try {
        const paper = new ExamPaper(req.body);
        await paper.save();
        res.status(201).json({ message: 'Draft saved successfully', id: paper._id });
    } catch (error) {
        console.error('Save Draft Error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Event Logging API
app.post('/api/log-event', async (req, res) => {
    try {
        const { userId, intent, params } = req.body;
        // Basic validation
        if (!intent) return res.status(400).send({ error: 'Intent required' });

        const event = new EventStore({
            userId: userId || 'anonymous',
            intent,
            params
        });
        await event.save();
        res.status(201).send({ success: true });
    } catch (error) {
        console.error('Event Log Error:', error);
        res.status(500).send({ error: 'Failed to log event' });
    }
});

// Suggestion API
app.get('/api/user-suggestions', async (req, res) => {
    try {
        const userId = 'teacher-123'; // Mock ID matching logEvent

        // Frequent Class
        const classStats = await EventStore.aggregate([
            { $match: { userId, intent: 'save_question_paper', 'params.class': { $exists: true } } },
            { $group: { _id: "$params.class", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // Frequent Subject
        const subjectStats = await EventStore.aggregate([
            { $match: { userId, intent: 'save_question_paper', 'params.subject': { $exists: true } } },
            { $group: { _id: "$params.subject", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const suggestions = {};
        if (classStats.length > 0) suggestions.class = classStats[0]._id;
        if (subjectStats.length > 0) suggestions.subject = subjectStats[0]._id;

        res.json(suggestions);
    } catch (error) {
        console.error('Suggestion Error:', error);
        res.status(500).json({});
    }
});

// Cloud Sync Upload API
app.post('/api/sync-cloud', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
        message: 'File uploaded successfully',
        url: req.file.path,
        public_id: req.file.filename
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
