import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';  // correct import
import StudentManagement from './components/StudentManagement';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
