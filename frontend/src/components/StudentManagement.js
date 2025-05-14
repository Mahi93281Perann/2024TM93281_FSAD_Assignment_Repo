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
      const response = await axios.get('http://localhost:5000/students/');  
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  fetchStudents();
}, []);


  const handleAddStudent = async () => {
    try {
      const response = await axios.post('http://localhost:5000/students/', newStudent);
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
      alert('Student already exists');
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
    <div className="student-management" style={{ padding: '30px', fontSize: '20px', çenter: 'center' }}>
     

<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    padding: '40px',
  }}
>
  {/* Manage Students Form (Left Column) */}
  <div style={{ flex: 1 }}>
    <h1
      style={{
        fontSize: '50px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Georgia, serif',
      }}
    >
      Manage Students
    </h1>

    <div
      className="add-student"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontSize: '24px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        marginBottom: '20px',
      }}
    >
      {/* Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Name:</label>
        <input
          style={{ fontSize: '24px', flex: 1, marginLeft: '10px' }}
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
      </div>

      {/* Student ID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Student ID:</label>
        <input
          style={{ fontSize: '24px', flex: 1, marginLeft: '10px' }}
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={newStudent.student_id}
          onChange={handleInputChange}
        />
      </div>

      {/* Grade */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Grade:</label>
        <input
          style={{ fontSize: '24px', flex: 1, marginLeft: '10px' }}
          type="text"
          name="grade"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={handleInputChange}
        />
      </div>

      {/* Vaccinated */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Vaccinated:</label>
        <input
          type="checkbox"
          checked={newStudent.is_vaccinated}
          onChange={handleCheckboxChange}
          style={{ transform: 'scale(1.5)', marginLeft: '10px' }}
        />
      </div>

      {/* Vaccine Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Vaccine Name:</label>
        <input
          style={{ fontSize: '24px', flex: 1, marginLeft: '10px' }}
          type="text"
          name="vaccine_name"
          placeholder="Vaccine Name"
          value={newStudent.vaccine_name}
          onChange={handleInputChange}
        />
      </div>

      {/* Vaccination Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Vaccination Date:</label>
        <input
          style={{ fontSize: '24px', flex: 1, marginLeft: '10px' }}
          type="date"
          name="vaccination_date"
          value={newStudent.vaccination_date}
          onChange={handleInputChange}
        />
      </div>

      <button
        onClick={handleAddStudent}
        style={{
          marginTop: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '10px',
          borderRadius: '6px',
          backgroundColor: '#007BFF',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        + Add Student
      </button>
    </div>
  </div>

  {/* Student List (Right Column) */}
  <div style={{ flex: 1 }}>
    <div
      className="student-list"
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        maxHeight: '900px',
        overflowY: 'auto',
      }}
    >
      <h1
      style={{
        fontSize: '40px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Georgia, serif',
      }}
    >
      Student List
    </h1>
      <ul
        style={{
          listStyleType: 'disc',
          paddingLeft: '20px',
          textAlign: 'left',
        }}
      >
        {students.map((student) => (
          <li
            key={student.id}
            style={{
              fontSize: '24px',
              marginBottom: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={`${student.name} - Grade ${student.grade} - ID: ${student.student_id} - ${
              student.is_vaccinated
                ? `Vaccinated (${student.vaccine_name} on ${student.vaccination_date})`
                : 'Not Vaccinated'
            }`}
          >
            <strong>{student.name}</strong> — Grade {student.grade} — ID: {student.student_id} —{' '}
            {student.is_vaccinated
              ? `Vaccinated (${student.vaccine_name} on ${student.vaccination_date})`
              : 'Not Vaccinated'}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


    </div>
  );
};

export default StudentManagement;
