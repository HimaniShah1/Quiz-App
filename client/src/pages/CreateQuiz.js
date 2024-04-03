import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";

const CreateQuiz = () => {
  const navigate = useNavigate();
  
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    duration: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''], 
    correctAnswer: ''
  });

  const handleQuizDetailsChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[index][name] = value;
    setQuizDetails(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };
  
  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const updatedOptions = [...quizDetails.questions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[questionIndex].options = updatedOptions;
    setQuizDetails(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setQuizDetails(prevState => ({
      ...prevState,
      questions: [...prevState.questions, currentQuestion]
    }));
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    
    try {
      const quizDetailsWithOptions = {
        ...quizDetails,
        questions: quizDetails.questions.map(question => ({
          ...question,
          options: question.options.filter(option => option.trim() !== '')
        }))
      };
  
      const response = await fetch('https://quiz-app-2wke.onrender.com/createquiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizDetailsWithOptions)
      });
        
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      navigate('/quizes');
  
      console.log('Quiz submitted successfully');
    } catch (error) {
      console.error('Error submitting quiz:', error.message);
    }
    
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions.splice(index, 1); 
    setQuizDetails(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };

  return (
    <div className='create-quiz'>
      <h2>Create Quiz</h2>
      <form onSubmit={submitQuiz}>
        <label>Title:</label>
        <input required={true} type="text" name="title" value={quizDetails.title} onChange={handleQuizDetailsChange} />
        <br />
        <label>Description:</label>
        <textarea name="description" value={quizDetails.description} onChange={handleQuizDetailsChange} />
        <br />
        <label>Duration (in minutes):</label>
        <input required={true} type="number" name="duration" value={quizDetails.duration} onChange={handleQuizDetailsChange} />
        <br />
        <h3>Questions:</h3>
        {quizDetails.questions.map((question, index) => (
          <div key={index}><br/>
            <label>Question {index + 1}:</label>
            <textarea 
              name="text" 
              value={question.text} 
              onChange={(e) => handleQuestionChange(e, index)} 
              rows={4} 
              cols={50} 
            />           
             <br />
            {question.options.map((option, i) => (
              <div key={i}>
                <label>Option {i + 1}:</label>
                <input type="text" value={option} onChange={(e) => handleOptionChange(e, index, i)} />
              </div>
            ))}
            <label>Correct Answer:</label>
            <input type="text" name="correctAnswer" value={question.correctAnswer} onChange={(e) => handleQuestionChange(e, index)} />
            <br />
            <button type="button" className='delete-button' onClick={() => deleteQuestion(index)}><MdDelete /></button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Question</button>
        <br />
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
