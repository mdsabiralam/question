const fs = require('fs');
const path = require('path');

// Dummy data structure matching our mockData logic
// We generate a few questions per class per subject
const subjects = ['Math', 'Science', 'Bengali', 'English', 'History'];
const classes = ['class-6', 'class-7', 'class-8', 'class-9', 'class-10'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const generateQuestions = (cls, subject) => {
  const questions = [];
  for (let i = 1; i <= 5; i++) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    questions.push({
      id: `${cls}-${subject}-q${i}`,
      title: `Sample ${subject} Question ${i} for ${cls}`,
      subject: subject,
      type: i % 2 === 0 ? 'MCQ' : 'Short Answer',
      marks: i % 2 === 0 ? 1 : 5,
      class: cls,
      difficulty: difficulty
    });
  }
  return questions;
};

const baseDir = path.join(__dirname, '../src/data/question-bank');

// Ensure base directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

classes.forEach(cls => {
  const classDir = path.join(baseDir, cls);
  if (!fs.existsSync(classDir)) {
    fs.mkdirSync(classDir);
  }

  subjects.forEach(subject => {
    const subjectDir = path.join(classDir, subject);
    if (!fs.existsSync(subjectDir)) {
      fs.mkdirSync(subjectDir);
    }

    const data = generateQuestions(cls, subject);
    const filePath = path.join(subjectDir, 'questions.json');

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Generated ${filePath}`);
  });
});

console.log('Question Bank generation complete.');
