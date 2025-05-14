import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';  // correct import
import StudentManagement from './components/StudentManagement';
import ManageDrives from './components/ManageDrives';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/Signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-students" element={<StudentManagement />} />
        <Route path="/manage-drives" element={<ManageDrives />} />
      </Routes>
    </Router>
  );
}

export default App;
