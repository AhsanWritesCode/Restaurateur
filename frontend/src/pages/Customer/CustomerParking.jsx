import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerParking.css'; // optional for styling

const CustomerParking = () => {
    const [parkingSpaces, setParkingSpaces] = useState([]);

    useEffect(() => {
        const fetchParkingSpaces = async () => {
            try {
                const res = await axios.get('http://localhost:8800/ParkingSpace');
                setParkingSpaces(res.data);
            } catch (err) {
                console.error('Failed to fetch parking spaces:', err);
            }
        };

        fetchParkingSpaces();
    }, []);

    return (
        <div className="customer-parking">
            <h2>Available Parking Spaces</h2>
            <table>
                <thead>
                    <tr>
                        <th>Space Number</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {parkingSpaces.map((space) => (
                        <tr key={space.Space_number}>
                            <td>{space.Space_number}</td>
                            <td>{space.Type}</td>
                            <td style={{ color: space.Vacancy ? 'green' : 'red' }}>
                                {space.Vacancy ? 'Available' : 'Occupied'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerParking;
