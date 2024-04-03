import React, {useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdLink,  MdDelete, MdEditDocument  } from "react-icons/md";
import { UserContext } from '../contexts/UserContext';

function QuizPage() {
  const { _id } = useParams();
  const [quizDetails, setQuizDetails] = useState(null);
  const {userInfo, setUserInfo} = useContext(UserContext);
  const navigate = useNavigate();

  const [quizLink, setQuizLink] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    answers: [],
  });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);



  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`https://quiz-app-2wke.onrender.com/quizzes/${_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz details');
        }
        const quizData = await response.json();
        setQuizDetails(quizData);
        setQuizLink(window.location.href);
      } catch (error) {
        console.error('Error fetching quiz details:', error.message);
      }
    };

    fetchQuizDetails();
  }, [_id]);

  function copyToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.value = quizLink;
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert('Link copied to clipboard!');
}

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataWithAnswers = {
      ...formData,
      quizTitle: quizDetails.title,
      answers: quizDetails.questions.map((question, index) => ({
        question: question.text,
        answer: formData[`question_${index}`] || 'Not answered' 
      }))
    };

    console.log('Form Data with Answers:', formDataWithAnswers);

    try {
      const response = await fetch('https://quiz-app-2wke.onrender.com/saveQuizResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataWithAnswers)
      });
      if (!response.ok) {
        throw new Error('Failed to save quiz results');
      }
      console.log('You have successfully submitted the quiz!');
      setQuizSubmitted(true);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving quiz results:', error.message);
    }
  };

  const deleteQuiz = async () => {
    try {
      const response = await fetch(`https://quiz-app-2wke.onrender.com/quizzes/${_id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if(response.ok) {
          navigate('/quizes')
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }
      console.log('Quiz deleted successfully');
    } catch (error) {
      console.error('Error deleting quiz:', error.message);
    }
  };

  if (!quizDetails) {
    return <div>Loading...</div>;
  }

  if (quizSubmitted) {
    return <div>Quiz submitted successfully!</div>;
  }

  if (isSubmitted) {
    return null;
  }

  const calculateRows = (text) => {
    const lines = text.split('\n').length;
    return lines > 1 ? lines : 1;
  };

  console.log('Quiz Details:', quizDetails);
  console.log("userInfo", userInfo)

  const { title, description, duration,questions } = quizDetails;
  const username = userInfo?.username;

  return (
    <div className='quiz-page'>
      <div className='link'>
      <h1>{title}</h1>
      {username && (
      <div >
        <button className='link-button' onClick={copyToClipboard}><MdLink /></button>
        <Link to={`/edit/${_id}`}><button className='edit-button'><MdEditDocument /></button></Link>
        <button className='delete-button' onClick={deleteQuiz}><MdDelete /></button>
      </div>
    )}
      </div>
      <p>{description}</p>
      <p>Duration: {duration} minutes</p>
      <form onSubmit={handleSubmit}>
        <div className='candidate-details'>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          <label htmlFor="number">Number:</label>
          <input type="tel" id="number" name="number" pattern="[0-9]{10}" value={formData.number} onChange={handleInputChange} required />
        </div>
       
        {questions.map((question, index) => (
          <div key={question._id}>
          <span>{index + 1}.</span>              
          <textarea
                name={`question_${index}`}
                value={question.text}
                onChange={(e) => handleInputChange(e, index)}
                rows={calculateRows(question.text)}
                cols={50}
              />
            <ul className='options-list'>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>
                  <label>
                    <input 
                      type="radio" 
                      required={true} 
                      name={`question_${index}`} 
                      value={option} 
                      onChange={handleInputChange}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default QuizPage;
