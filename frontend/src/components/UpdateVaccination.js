import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateVaccination = ({ studentId }) => {
    const [vaccineList, setVaccineList] = useState([]);
    const [vaccine, setVaccine] = useState('');
    const [status, setStatus] = useState('');
    const [driveId, setDriveId] = useState('');

    // Fetch available vaccination drives (to get vaccine + drive IDs)
    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await axios.get('/active_drives');
                setVaccineList(res.data);
            } catch (err) {
                console.error('Error fetching vaccine list:', err);
            }
        };
        fetchVaccines();
    }, []);

    const handleUpdate = async () => {
        try {
            if (!driveId || !status) {
                alert("Please select a vaccine and status");
                return;
            }

            await axios.post('/api/vaccinate', {
                student_id: studentId,
                drive_id: driveId,
                status: status  // Optional if your backend defaults to "Completed"
            });

            alert('Vaccination status updated');
        } catch (error) {
            console.error(error);
            alert('Error updating vaccination status');
        }
    };

    return (
        <div>
            <label>Vaccine</label>
            <select value={driveId} onChange={(e) => {
                const selected = vaccineList.find(v => v.id === parseInt(e.target.value));
                setDriveId(e.target.value);
                setVaccine(selected?.vaccine_name || '');
            }}>
                <option value="">-- Select Vaccine --</option>
                {vaccineList.map((v) => (
                    <option key={v.id} value={v.id}>{v.vaccine_name} (Drive on {v.date})</option>
                ))}
            </select>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">-- Select Status --</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
            </select>

            <button onClick={handleUpdate}>Update Vaccination Status</button>
        </div>
    );
};

export default UpdateVaccination;
