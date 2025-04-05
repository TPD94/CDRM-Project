import React, { useEffect, useState } from 'react';
import Login from '../Login/Login';

function MyAccount() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const loggedInCookie = cookies.find(row => row.startsWith('is_logged_in='));
    if (loggedInCookie && loggedInCookie.split('=')[1] === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to set logged-in state
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <h1>Welcome to your account</h1>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default MyAccount;
