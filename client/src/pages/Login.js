import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Login() {
  const[username, setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if(response.ok){
      response.json().then(
        userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      })     
    } else{
      alert('worng credentials');
    }

  }

  if(redirect){
    return <Navigate to={'/quizes'} />
  }

  return (
    <div className='login'>
      <form onSubmit={handleLogin}>
        
        <input 
         type="text"
         placeholder='username'
         value={username}
         onChange={ e => setUsername(e.target.value)}
        />

        <input 
         type="password"
         placeholder='password'
         value={password}
         onChange={e => setPassword(e.target.value)}
        />

        <button>Login</button>
        <Link className='login-link' to='/register'>Don't have an account? Register here.</Link>
        
      </form>
    </div>
  )
}

export default Login
