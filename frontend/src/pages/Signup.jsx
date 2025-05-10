import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Install axios if not done yet

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log("Form Data being sent:", formData);
      const response = await axios.post('http://localhost:5000/auth/signup', formData);
      console.log('Signup Success:', response.data);

      // Redirect to login page after signup success
      navigate('/login');
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;

