const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: Number,
    questions: [{
      text: String,
      options: [String],
      correctAnswer: String
    }]
  });

  const Quiz = mongoose.model('Quiz', QuizSchema);
  module.exports = Quiz;