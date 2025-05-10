import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/auth/login', {
            username,
            password
        });

        // If backend says login successful
        console.log(response)
        //alert(response.data.message);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
    } catch (error) {
        alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
};

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>School Vaccination Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ margin: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;