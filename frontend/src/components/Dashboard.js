import React, { useEffect, useState } from 'react';
import VaccinationDropdown from './VaccinationDropdown'; // Adjust the path if needed

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch('http://localhost:5000/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        const count = data.filter((s) => s.vaccination_status === 'Vaccinated').length;
        setVaccinatedCount(count);
      })
      .catch((err) => console.error('Failed to fetch students:', err));
  };

  const handleVaccinate = (studentId, driveId) => {
    fetch(`http://localhost:5000/students/${studentId}/vaccinate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drive_id: driveId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Vaccination successful:', data);
        fetchStudents(); // Refresh list after vaccination
      })
      .catch((err) => console.error('Vaccination failed:', err));
  };

  const totalStudents = students.length;
  const percentage = totalStudents === 0 ? 0 : ((vaccinatedCount / totalStudents) * 100).toFixed(2);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome,</h2>
      <p>Total Students: {totalStudents}</p>
      <p>Vaccinated: {vaccinatedCount}</p>
      <p>Percentage Vaccinated: {percentage}%</p>

      <button>Manage Students</button>
      <button>Manage Drives</button>
      <button>View Reports</button>

      <h3>Upcoming Drives</h3>
      <p>No upcoming drives scheduled.</p> {/* You can replace this with actual data later */}

      <h3>Student Vaccination Status</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Status</th>
            <th>Eligible Vaccine</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.vaccination_status || 'Not Vaccinated'}</td>
              <td>
                {!s.vaccination_status ? (
                  <VaccinationDropdown studentId={s.id} onVaccinate={handleVaccinate} />
                ) : (
                  '-'
                )}
              </td>
              <td>
                {s.vaccination_status ? (
                  <button disabled>Vaccinated</button>
                ) : (
                  <span>Use dropdown</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
