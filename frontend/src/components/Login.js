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
      <h2>Student Vaccination Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ margin: '10px' }}>
          <input
            size={16}
            style={{ fontSize: '24px', fontWeight: 'bold' }}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: '10px'}}>
          <input
            size={16}
            style={{ fontSize: '24px', fontWeight: 'bold' }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ width: '120px', height: '40px', fontSize: '24px', fontWeight:'bold' }}>Login</button>
        
      </form>
    </div>
  );
};

export default Login;