import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentManagement = () => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    student_id: '',
    grade: '',
    is_vaccinated: false,
    vaccine_name: '',
    vaccination_date: ''
  });

  const [students, setStudents] = useState([]);

  // Fetch students when component mounts
  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');  // <-- Check this path
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  fetchStudents();
}, []);


  const handleAddStudent = async () => {
    try {
      const response = await axios.post('http://localhost:5000/students', newStudent);
      setStudents([...students, response.data]);  // Add to list
      // Reset form
      setNewStudent({
        name: '',
        student_id: '',
        grade: '',
        is_vaccinated: false,
        vaccine_name: '',
        vaccination_date: ''
      });
    } catch (error) {
      alert('Failed to add student');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setNewStudent({ ...newStudent, is_vaccinated: e.target.checked });
  };

  return (
    <div className="student-management">
      <h2>Manage Students</h2>
      <div className="add-student">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={newStudent.student_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={handleInputChange}
        />
        <label>
          Vaccinated:
          <input
            type="checkbox"
            checked={newStudent.is_vaccinated}
            onChange={handleCheckboxChange}
          />
        </label>
        <input
          type="text"
          name="vaccine_name"
          placeholder="Vaccine Name"
          value={newStudent.vaccine_name}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="vaccination_date"
          placeholder="Vaccination Date"
          value={newStudent.vaccination_date}
          onChange={handleInputChange}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>

      <div className="student-list">
        <h3>Student List</h3>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} - Grade {student.grade} - ID: {student.student_id} - 
              {student.is_vaccinated
                ? `Vaccinated (${student.vaccine_name} on ${student.vaccination_date})`
                : 'Not Vaccinated'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentManagement;
