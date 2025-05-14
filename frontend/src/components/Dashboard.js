import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VaccinationDropdown from './VaccinationDropdown';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);
  const [driveStats, setDriveStats] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: 'grey',
    marginBottom: '50px',
    width: '370px',
    height: '60px',
    fontSize: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    };

  useEffect(() => {
    fetchStudents();
    fetchDriveStats();
  }, []);

  const fetchStudents = () => {
    fetch('http://localhost:5000/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        const count = data.filter(s => s.is_vaccinated).length;
        setVaccinatedCount(count);
      })
      .catch(err => console.error('Failed to fetch students:', err));
  };

  const fetchDriveStats = () => {
    fetch('http://localhost:5000/drives/active')
      .then(res => res.json())
      .then(activeDrives => {
        Promise.all(
          activeDrives.map(d =>
            fetch(`http://localhost:5000/vaccination/stats/${d.id}`)
              .then(res => res.json())
          )
        ).then(stats => setDriveStats(stats));
      })
      .catch(err => console.error('Failed to fetch drive stats:', err));
  };

  const handleVaccinate = (studentId, driveId, vaccineName) => {
    fetch('http://localhost:5000/vaccination/vaccinate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, drive_id: parseInt(driveId), vaccine_name: vaccineName }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Vaccination failed: ' + data.error);
        } else {
          alert('Vaccination successful!');
          fetchStudents();
          fetchDriveStats();
        }
      })
      .catch(err => {
        console.error('Vaccination error:', err);
        alert('Vaccination failed: ' + err.message);
      });
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    fetch('http://localhost:5000/students/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        alert('Upload successful!');
        fetchStudents();
      })
      .catch(err => {
        console.error('Upload failed:', err);
        alert('Upload failed: ' + err.message);
      });
  };

  const totalStudents = students.length;
  const percentage = totalStudents === 0 ? 0 : ((vaccinatedCount / totalStudents) * 100).toFixed(2);

    
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '80px' , borderTop: '2px solid black', borderBottom: '2px solid black'}}>
      {/* Left Column (Sidebar) */}
  <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'lightgray', padding: '30px' }}>
    <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '60px' , textAlign:'Left'}}>Dashboard</h2>
    <button onClick={() => navigate('/manage-students')} style={buttonStyle}>Manage Students</button>
    <button onClick={() => navigate('/manage-drives')} style={buttonStyle}>Manage Drives</button>
    <input size={40} backgroundColor="gray" 
            style={{ fontSize: '25px', fontStyle: 'italic' }} type="file" accept=".csv" onChange={handleCsvChange} />
    <button onClick={handleCsvUpload} style={buttonStyle}>Upload CSV</button>
    <button onClick={() => window.open('http://localhost:5000/reports/students')} style={buttonStyle}>Download CSV Report</button>
  </div>

  {/* Right Column (Main Content) */}
  <div>
    <h1 style={{ position: 'relative', left: '40px',  fontSize: '50px', fontWeight: 'bold', padding: '30px', fontFamily: 'Georgia, serif' }}>Student Vaccination Dashboard</h1>
    <h2>Welcome,</h2>

    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '60px', margin: '20px' }}>
  <div style={{ fontSize: '24px', width: '200px', padding: '15px', border: '1px solid black' }}>
    Total Students: {totalStudents}
  </div>
  <div style={{ fontSize: '24px', width: '200px', padding: '15px', border: '1px solid black' }}>
    Vaccinated: {vaccinatedCount}
  </div>
</div>



    <div style={{ position: 'relative', left: '70px', top: '15px', bottom: '15px', fontSize: '24px', width: '25%', padding: '15px', border: '1px solid black' }}>
        Percentage Vaccinated: {percentage}%
  </div>
    
    <h3 style={{ position: 'relative', left: '300px', top: '15px', fontSize: '30px', fontWeight: 'bold' }}> Drive Statistics</h3>
    {driveStats.length === 0 ? (
      <p>No active drives found.</p>
    ) : (
      <table border="1" cellPadding="15" style={{fontSize: '20px', textAlign: 'center'}}>
        <thead>
          <tr>
            <th>Drive</th>
            <th>Date</th>
            <th>Eligible</th>
            <th>Vaccinated</th>
            <th>Coverage %</th>
            <th>Remaining Doses</th>
          </tr>
        </thead>
        <tbody>
          {driveStats.map(stat => (
            <tr key={stat.drive_id}>
              <td>{stat.vaccine_name}</td>
              <td>{stat.date}</td>
              <td>{stat.eligible_students}</td>
              <td>{stat.vaccinated}</td>
              <td>{stat.coverage_percent}%</td>
              <td>{stat.remaining_doses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    <h3 style={{ position: 'relative', left: '250px', top: '15px', fontSize: '30px', fontWeight: 'bold' }}> Student Vaccination Status</h3>
    <table border="1" cellPadding="15" style={{fontSize: '20px', textAlign: 'center'}}>
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
            <td>{s.grade}</td>
            <td>{s.is_vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</td>
            <td>
              {!s.is_vaccinated ? (
                <VaccinationDropdown studentId={s.id} onVaccinate={handleVaccinate} />
              ) : (
                '-'
              )}
            </td>
            <td>
              {s.is_vaccinated ? (
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
</div>

  );
};

export default Dashboard;
