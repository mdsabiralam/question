const fs = require('fs');
const path = require('path');

// Dummy data structure matching our mockData logic
// We generate a few questions per class per subject
const subjects = ['Math', 'Science', 'Bengali', 'English', 'History'];
const classes = ['class-6', 'class-7', 'class-8', 'class-9', 'class-10'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const types = ['MCQ', 'Short Answer', 'Creative'];

const generateQuestions = (cls, subject) => {
  const questions = [];
  for (let i = 1; i <= 6; i++) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    // Cycle through types: 0->MCQ, 1->Short, 2->Creative...
    const type = types[(i - 1) % types.length];

    // Assign marks based on type for realism
    let marks = 1;
    if (type === 'Short Answer') marks = 5;
    if (type === 'Creative') marks = 10;

    questions.push({
      id: `${cls}-${subject}-q${i}`,
      title: `Sample ${subject} Question ${i} for ${cls}`,
      subject: subject,
      type: type,
      marks: marks,
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
