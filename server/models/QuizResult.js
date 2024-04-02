const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', 
  },
  quizTitle: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  answers: [
    {
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    }
  ]
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
module.exports = QuizResult;
