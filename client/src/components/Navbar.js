import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext';

function Navbar() {
    const {userInfo, setUserInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);


    useEffect(() => {
        fetch('https://quiz-app-2wke.onrender.com/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            })
        })
    },[]);

    function logout() {
        fetch('https://quiz-app-2wke.onrender.com/logout',{
            credentials: 'include',
            method: 'POST',
        });
        setRedirect(true);
    }

    if(redirect){
        return <Navigate to={'/'} />
      }


  return (
    <nav className='navbar'>
        <Link className='site-title'>QuizIt</Link>
       
            <>
            <ul>
            <li>
                <Link to='/quizes'>Quizzes</Link> 
            </li>
            <li>
                <Link to='/results'>Results</Link> 
            </li>
            <li>
                <a  onClick={logout}>Logout</a>
            </li>
            </ul>      
        </>
    
        
        
    </nav>
  )
}

export default Navbar

