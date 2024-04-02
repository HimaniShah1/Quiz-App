import React from 'react'
import { Link } from 'react-router-dom'


function Quiz({ id, title}) {
    console.log('Quiz _id:', {id});
  return (
    <div className='quiz'>
        <Link to={ `/quiz/${id}` }>
        <div className='quiz-title'><h1>{title}</h1></div>
        </Link>
        {/* <div className='quiz-link'>Quiz Link: </div> */}
      
    </div>
  )
}

export default Quiz
