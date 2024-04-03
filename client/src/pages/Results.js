import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function Results() {
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const response = await fetch('https://quiz-app-2wke.onrender.com/result'); 
        if (!response.ok) {
          throw new Error('Failed to fetch quiz result');
        }
        const resultData = await response.json();
        setQuizResult(resultData);
      } catch (error) {
        console.error('Error fetching quiz result:', error.message);
      }
    };

    fetchQuizResult();
  }, []);

  const calculateScore = (answers) => {
    let score = 0;
    answers.forEach(answer => {
      if (answer.answer === answer.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const [showAnswers, setShowAnswers] = useState({});

  const toggleAnswers = (index) => {
    setShowAnswers(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  console.log('Quiz Results', quizResult)


  return (
    <div>
      <Navbar />
      <div className='result-page'>
        {quizResult === null ? (
          <div>Loading...</div>
        ) : (
          quizResult.map((result, index) => (
            <div key={result._id} className='result' onClick={() => toggleAnswers(index)}>
              <div className='result-title'><h2>{result.quizTitle}</h2></div>   
                <ul className='candidate-details-result'>
                  <li>Candidate: {result.name}</li>
                  <li>Email: {result.email}</li>
                  <li>No.: {result.number}</li>
                </ul>
              <div className='score'>
                <h3>Result: {calculateScore(result.answers)} / {result.answers.length}</h3>
                {showAnswers[index] && (
                  <div>
                    <h4>Answers:</h4>
                    <ul className='result-answers'>
                      {result.answers.map(answer => (
                        <li key={answer._id}>
                          {answer.question}<br />
                          <b>Candidate Answer:</b> {answer.answer}<br />
                          <b>Correct Answer:</b> {answer.correctAnswer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
           </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Results;
