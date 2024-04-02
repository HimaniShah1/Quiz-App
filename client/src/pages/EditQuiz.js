import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";

const EditQuiz = () => {
  const { id } = useParams(); 
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

  useEffect(() => {
    console.log("Fetching quiz details for ID:", id); 
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz details');
        }
        const quizData = await response.json();
        console.log("Fetched quiz details:", quizData);
        setQuizDetails(quizData);
      } catch (error) {
        console.error('Error fetching quiz details:', error.message);
      }
    };

    fetchQuizDetails();
  }, [id]);

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

  const deleteQuestion = (index) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions.splice(index, 1); 
    setQuizDetails(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };



  const saveChanges = async (e) => {
    e.preventDefault();

    try {
        console.log("Saving quiz changes:", quizDetails);
      const response = await fetch(`http://localhost:3001/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizDetails)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save quiz changes');
      }

      navigate('/quizes');
    } catch (error) {
      console.error('Error saving quiz changes:', error.message);
    }
  };

  return (
    <div className='edit-quiz'>
      <h2>Edit Quiz</h2>
     <form onSubmit={saveChanges}>
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
            />            <br />
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditQuiz;
