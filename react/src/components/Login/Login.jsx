import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      username,
      password
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Display the success message
        onLoginSuccess(); // Trigger the parent component's state change
        // Optionally, redirect or handle further logic here
      } else {
        const errorData = await response.json();
        alert('Login failed: ' + errorData.message); // Handle failure
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <>
      <div className='flex flex-col min-w-full min-h-full w-full h-full bg-zinc-900 overflow-auto items-center justify-center'>
        <div className='flex flex-col w-3/10 h-5/10 bg-zinc-900 shadow-lg shadow-amber-400 rounded-2xl items-center overflow-hidden'>
          <form onSubmit={handleLogin} className='flex flex-col w-1/2 h-full p-5'>
            <label htmlFor='username' className='text-white mb-1'>Username:</label>
            <input 
              type='text' 
              id='username' 
              name='username' 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className='text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded focus:shadow-sm focus:shadow-amber-400/50 transition-shadow duration-300 ease-in-out p-2' 
            />
            <label htmlFor='password' className='text-white mb-1 mt-1'>Password:</label>
            <input 
              type='password' 
              id='password' 
              name='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className='text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded focus:shadow-sm focus:shadow-amber-400/50 transition-shadow duration-300 ease-in-out p-2' 
            />
            <div className='flex flex-row mt-5 w-full justify-around'>
              <button type='submit' className='bg-slate-600 text-white p-2 rounded-xl w-1/3 hover:bg-slate-500 transition-colors duration-300 ease-in-out active:transform active:scale-95 overflow-hidden text-sm cursor-pointer'>
                Login
              </button>
              <button type='button' className='bg-slate-600 text-white p-2 rounded-xl w-1/3 hover:bg-slate-500 transition-colors duration-300 ease-in-out active:transform active:scale-95 overflow-hidden text-sm cursor-pointer'>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
