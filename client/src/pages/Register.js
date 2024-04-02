import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
    });
    if(response.status === 200) {
      alert('Registration Successfull.')
      navigate('/');
    } else{
      alert('Registration Failed.')
    }
  }

  return (
    <div className='register'>
        <form onSubmit={handleRegister}>
        <input 
         type="text"
         placeholder='username'
         value={username}
         onChange={e => setUsername(e.target.value)}
        />

        <input 
         type="password"
         placeholder='password'
         value={password}
         onChange={e => setPassword(e.target.value)}
        />

        <button>Register</button>
        <Link to='/' className='login-link'>Already have an account? Login here.</Link>
        
      </form>
      
    </div>
  )
}

export default Register
