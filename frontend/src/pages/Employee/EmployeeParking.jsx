import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeParking.css';

const EmployeeParking = () => {
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [spaceNumber, setSpaceNumber] = useState('');
    const [type, setType] = useState('');
    const [vacancy, setVacancy] = useState(true);

    const fetchParkingSpaces = async () => {
        try {
            const res = await axios.get('http://localhost:8800/ParkingSpace');
            setParkingSpaces(res.data);
        } catch (err) {
            console.error('Failed to fetch parking spaces:', err);
        }
    };

    useEffect(() => {
        fetchParkingSpaces();
    }, []);

    const handleAddParkingSpace = async () => {
        if (!spaceNumber || !type) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const newParkingSpace = {
                Space_number: spaceNumber,
                Type: type,
                Vacancy: vacancy,
            };

            await axios.post('http://localhost:8800/ParkingSpace', newParkingSpace);
            setSpaceNumber('');
            setType('');
            setVacancy(true);
            fetchParkingSpaces(); // refresh full list
        } catch (err) {
            console.error('Failed to add parking space:', err);
            alert('Error adding parking space.');
        }
    };

    const handleDeleteParkingSpace = async (spaceNumber) => {
        try {
            await axios.delete(`http://localhost:8800/ParkingSpace/${spaceNumber}`);
            fetchParkingSpaces();
        } catch (err) {
            console.error('Failed to delete parking space:', err);
            alert('Error deleting parking space.');
        }
    };

    const handleToggleVacancy = async (spaceNumber, currentVacancy) => {
        try {
            await axios.put(`http://localhost:8800/ParkingSpace/${spaceNumber}`, {
                Vacancy: !currentVacancy,
            });
            fetchParkingSpaces();
        } catch (err) {
            console.error('Failed to update vacancy:', err);
            alert('Error updating vacancy.');
        }
    };

    return (
        <div className="employee-parking">
            <h2>Employee Parking Management</h2>
            <div className="add-parking-form">
                <h3>Add Parking Space</h3>
                <div>
                    <label>Space Number:</label>
                    <input
                        type="number"
                        value={spaceNumber}
                        onChange={(e) => setSpaceNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Select Type</option>
                        <option value="Street Parking">Street Parking</option>
                        <option value="Underground">Underground</option>
                        <option value="Parking Lot">Parking Lot</option>
                    </select>
                </div>
                <div>
                    <label>Vacancy:</label>
                    <input
                        type="checkbox"
                        checked={vacancy}
                        onChange={() => setVacancy(!vacancy)}
                    />
                </div>
                <button onClick={handleAddParkingSpace}>Add Parking Space</button>
            </div>

            <h3>Existing Parking Spaces</h3>
            <table>
                <thead>
                    <tr>
                        <th>Space Number</th>
                        <th>Type</th>
                        <th>Vacancy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {parkingSpaces.map((space) => (
                        <tr key={space.Space_number}>
                            <td>{space.Space_number}</td>
                            <td>{space.Type}</td>
                            <td>{space.Vacancy ? 'Available' : 'Occupied'}</td>
                            <td>
                                <button onClick={() => handleToggleVacancy(space.Space_number, space.Vacancy)}>
                                    Toggle Vacancy
                                </button>
                                <button onClick={() => handleDeleteParkingSpace(space.Space_number)} style={{ marginLeft: '10px', color: 'red' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeParking;
