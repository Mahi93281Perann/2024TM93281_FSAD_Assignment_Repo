import React, { useState } from 'react';
import axios from 'axios';

const UpdateVaccination = ({ studentId }) => {
    const [vaccine, setVaccine] = useState('');
    const [status, setStatus] = useState('');

    const handleUpdate = async () => {
        try {
            await axios.put('/update_vaccination', {
                student_id: studentId,
                vaccine_name: vaccine,
                vaccination_status: status
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
            <select value={vaccine} onChange={(e) => setVaccine(e.target.value)}>
                <option value="Vaccine A">Vaccine A</option>
                <option value="Vaccine B">Vaccine B</option>
            </select>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
            </select>

            <button onClick={handleUpdate}>Update Vaccination Status</button>
        </div>
    );
};

export default UpdateVaccination;
