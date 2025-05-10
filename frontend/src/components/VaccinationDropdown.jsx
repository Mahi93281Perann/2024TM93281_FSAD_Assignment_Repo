import React, { useEffect, useState } from 'react';

const VaccinationDropdown = ({ studentId, onVaccinate }) => {
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');

  useEffect(() => {
    // Fetch available (upcoming) drives
    fetch('http://localhost:5000/drives/active')
      .then(res => res.json())
      .then(data => setDrives(data))
      .catch(err => console.error("Error fetching drives:", err));
  }, []);

  const handleVaccinate = () => {
    if (!selectedDriveId) return;
    onVaccinate(studentId, selectedDriveId);
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <select
        value={selectedDriveId}
        onChange={(e) => setSelectedDriveId(e.target.value)}
      >
        <option value="">Select vaccine</option>
        {drives.map(d => (
          <option key={d.id} value={d.id}>
            {d.vaccine_name} ({d.date})
          </option>
        ))}
      </select>
      <button onClick={handleVaccinate} disabled={!selectedDriveId}>
        Vaccinate
      </button>
    </div>
  );
};

export default VaccinationDropdown;
