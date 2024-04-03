const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/QuizSchema')
const QuizResult = require('./models/QuizResult');
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'xhwqedbcikwqcljcbnjwdhciw';

app.use(cors({credentials: true, origin: 'https://quiz-app-1-yst4.onrender.com'}));
app.use(express.json());
app.use(cookieParser());

const PORT = 3001;

mongoose.connect('mongodb+srv://testuser:BTKtvYPzorVuHuxJ@quiz.5opofsd.mongodb.net/?retryWrites=true&w=majority&appName=Quiz')

app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
        const userDoc = await User.create(
            {
                username, 
                password: bcrypt.hashSync(password,salt),
            });
        res.json(userDoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token,{sameSite: 'none', secure: true}).json({
                id: userDoc._id,
                username,
            });
        })
    } else{
        res.status(400).json('Wrong credentials.');
    }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
      if(err) throw err;
      res.json(info);
  });
})

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
})

app.post('/createquiz', async (req, res) => {
    try {
      const quizData = req.body;
  
      const quiz = await Quiz.create(quizData);
  
      res.status(201).json(quiz);
    } catch (error) {
      console.log('Error saving quiz:', error.message);
      res.status(500).json({ error: 'Failed to save quiz' });
    }
  });

app.get('/quizzes', async (req, res) => {
    try {
      const quizzes = await Quiz.find({}, 'title');
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error.message);
      res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
  });

  app.get('/quizzes/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received quizId:', id);
    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz details:', error.message);
      res.status(500).json({ error: 'Failed to fetch quiz details' });
    }
  });

  app.put('/quizzes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, duration, questions } = req.body;
  
    try {
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
  
      quiz.title = title;
      quiz.description = description;
      quiz.duration = duration;
      quiz.questions = questions;
  
      await quiz.save();
  
      res.status(200).json({ message: 'Quiz updated successfully', quiz });
    } catch (error) {
      console.error('Error updating quiz:', error.message);
      res.status(500).json({ error: 'Failed to update quiz' });
    }
  });

  
app.post('/saveQuizResults', async (req, res) => {
  try {
    const formDataWithAnswers = req.body;
    const quizResult = await QuizResult.create(formDataWithAnswers);

    res.status(201).json({ message: 'Quiz results saved successfully', quizResult });
  } catch (error) {
    console.error('Error saving quiz results:', error.message);
    res.status(500).json({ error: 'Failed to save quiz results' });
  }
});

app.get('/result', async (req, res) => {
  try {
    const quizResult = await QuizResult.find().sort({ createdAt: -1 });
    if (!quizResult || quizResult.length === 0) {
      return res.status(404).json({ error: 'Quiz results not found' });
    }
    console.log('Quiz Results', quizResult);

    const quizzes = await Quiz.find();
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ error: 'Quizzes not found' });
    }
    console.log('Quizzes', quizzes);
    
    const resultsWithAnswers = quizResult.map(result => {
      const questionsWithCorrectAnswer = result.answers.map(answer => {
        const quiz = quizzes.find(q => q.title === result.quizTitle);
        if (!quiz) {
          console.error(`Quiz with title '${result.quizTitle}' not found`);
          return null;
        }
        console.log('Quiz', quiz);
        const question = quiz.questions.find(q => q.text === answer.question);
        if (!question) {
          console.error(`Question with text '${answer.question}' not found in quiz '${result.quizTitle}'`);
          return null;
        }
        return {
          question: answer.question,
          answer: answer.answer,
          correctAnswer: question.correctAnswer
        };
      }).filter(Boolean);
      return {
        quizTitle: result.quizTitle,
        name: result.name,
        email: result.email,
        number: result.number,
        answers: questionsWithCorrectAnswer
      };
    });

    console.log('Result', resultsWithAnswers);
    console.log(resultsWithAnswers[0].answers);

    res.json(resultsWithAnswers);
  } catch (error) {
    console.error('Error fetching quiz results:', error.message);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});


app.delete('/quizzes/:id', async(req, res) => {
  const quizId = req.params.id;

   try {
        await Quiz.findByIdAndDelete(quizId);
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }

})


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
