import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Quiz from '../components/Quiz'
import { Link } from 'react-router-dom'


function Quizes() {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
          const response = await fetch('http://localhost:3001/quizzes');
          if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
          }
          const data = await response.json();
          console.log('Quizzes data:', data); 
          setQuizzes(data);
        } catch (error) {
          console.error('Error fetching quizzes:', error.message);
        }
      };

  console.log('Quizzes', quizzes)
  // console.log('Link in Quizes', quizLink)


  return (
    <div>
      <Navbar />
      <div className='new'>
        <Link to='/createquiz'><button>New</button></Link>
      </div>
      
      {quizzes.length > 0 && quizzes.map(quiz => (
        quiz._id && <Quiz key={quiz._id} id={quiz._id} title={quiz.title} />
      ))}     

    </div>
  )
}

export default Quizes
