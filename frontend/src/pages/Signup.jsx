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
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>School Vaccination System</h2>
      <form onSubmit={handleSubmit}>
        <input size={20}
              style={{ fontSize: '20px', fontWeight: 'bold' , padding: '10px', margin: '10px'}}
              type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <br />
        <input size={20}
              style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px', margin: '10px' }}
              type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input size={20}
              style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px', margin: '10px' }}
              type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit" style={{ width: '120px', height: '40px', fontSize: '24px', fontWeight:'bold' }}>Signup</button>
        
      </form>
    </div>
  );
}

export default Signup;

