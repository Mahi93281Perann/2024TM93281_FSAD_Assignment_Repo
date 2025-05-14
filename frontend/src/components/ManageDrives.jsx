// src/components/ManageDrives.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [formData, setFormData] = useState({
    vaccine_name: '',
    drive_date: '',
    available_doses: '',
    applicable_classes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('http://localhost:5000/drives/');
      setDrives(response.data);
    } catch (error) {
      alert('Failed to fetch drives');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Logging form data before sending it to backend for easier debugging
    console.log('Form Data:', formData);
    
    const dataToSend = {
      ...formData,
      applicable_classes: formData.applicable_classes.split(',').map(c => c.trim())
    };

    if (editingId) {
      // Update existing drive
      const response = await axios.put(`http://localhost:5000/drives/${editingId}`, dataToSend);
      alert('Drive updated successfully');
    } else {
      // Create new drive
      const response = await axios.post('http://localhost:5000/drives/', dataToSend);
      alert('Drive created successfully');
    }

    // Reset form data
    setFormData({
      vaccine_name: '',
      drive_date: '',
      available_doses: '',
      applicable_classes: ''
    });
    setEditingId(null);
    fetchDrives(); // Reload the list of drives after successful create or update
  } catch (err) {
    // Check if backend returns error message and display it
    const errorMessage = err.response?.data?.error || 'Error saving drive';
    alert(errorMessage); // Show the error message from the backend
    console.error('Error details:', err.response?.data); // Log error details for debugging
  }
};


  const handleEdit = (drive) => {
    setEditingId(drive.id);
    setFormData({
      vaccine_name: drive.vaccine_name,
      drive_date: drive.drive_date,
      available_doses: drive.available_doses,
      applicable_classes: drive.applicable_classes
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axios.delete(`http://localhost:5000/drives/${id}`);
        alert('Drive deleted successfully');
        fetchDrives();
      } catch {
        alert('Failed to delete drive');
      }
    }
  };

  return (
  <div
    className="container mt-5"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '30px',
    }}
  >
    <h3 style={{ fontSize: '40px', fontWeight: 'bold', fontFamily: 'Georgia, serif', marginBottom: '30px' }}>
      {editingId ? 'Edit Vaccination Drive' : 'Create New Vaccination Drive'}
    </h3>

    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        backgroundColor: '#f9f9f9',
        marginBottom: '40px',
        fontFamily: 'Georgia, serif'
      }}
    >
      {/* Row: Vaccine Name */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ flex: 1, fontSize: '30px', fontWeight: 'bold' }}>Vaccine Name:</label>
        <input
          style={{ flex: 2, fontSize: '30px', height: '40px' }}
          type="text"
          name="vaccine_name"
          className="form-control"
          required
          value={formData.vaccine_name}
          onChange={handleInputChange}
        />
      </div>

      {/* Row: Drive Date */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ flex: 1, fontSize: '30px', fontWeight: 'bold' }}>Drive Date:</label>
        <input
          style={{ flex: 2, fontSize: '30px', height: '40px' }}
          type="date"
          name="drive_date"
          className="form-control"
          required
          value={formData.drive_date}
          onChange={handleInputChange}
        />
      </div>

      {/* Row: Available Doses */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ flex: 1, fontSize: '30px', fontWeight: 'bold' }}>Available Doses:</label>
        <input
          style={{ flex: 2, fontSize: '30px', height: '40px' }}
          type="number"
          name="available_doses"
          className="form-control"
          required
          value={formData.available_doses}
          onChange={handleInputChange}
        />
      </div>

      {/* Row: Applicable Classes */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <label style={{ flex: 1, fontSize: '30px', fontWeight: 'bold' }}>Applicable Classes:</label>
        <input
          style={{ flex: 2, fontSize: '30px', height: '40px' }}
          type="text"
          name="applicable_classes"
          placeholder="e.g. 1,2,3"
          className="form-control"
          required
          value={formData.applicable_classes}
          onChange={handleInputChange}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          type="submit"
          
          className="btn btn-primary"
          style={{ fontSize: '35px', fontWeight: 'bold', width: '160px', height: '45px' }}
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </div>
    </form>

    {/* Scheduled Drives Table */}
    <h4 style={{ fontSize: '40px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>Scheduled Drives</h4>
    <table className="table table-striped mt-4" style={{ fontSize: '30px', maxWidth: '1000px', width: '100%', marginRight:'20px'}}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Vaccine</th>
          <th>Date</th>
          <th>Doses</th>
          <th>Classes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {drives.map((d) => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.vaccine_name}</td>
            <td>{d.drive_date}</td>
            <td>{d.available_doses}</td>
            <td>{d.applicable_classes}</td>
            <td>
              <button
                onClick={() => handleEdit(d)}
                className="btn btn-sm btn-warning me-2"
                style={{ fontSize: '30px', marginRight: '10px', alignItems:'center' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="btn btn-sm btn-danger"
                style={{ fontSize: '30px' }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}

export default ManageDrives;