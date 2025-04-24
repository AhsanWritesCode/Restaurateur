import React, { useState } from 'react';
import axios from 'axios';

const ViewReservation = () => {
    const [reservationNo, setReservationNo] = useState('');
    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState('');

    const fetchReservation = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/reservations/${reservationNo}`);
            setReservation(response.data);
            setError('');
        } catch (err) {
            setError('Reservation not found');
            setReservation(null);
        }
    };

    const deleteReservation = async () => {
        try {
            const response = await axios.delete(`http://localhost:8800/reservations/${reservationNo}`);
            alert(response.data.message); // Success message
            setReservation(null); // Clear the reservation details
        } catch (err) {
            alert('Failed to delete reservation');
        }
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleString('en-US', {
            weekday: 'short', // "Mon"
            year: 'numeric', // "2025"
            month: 'short', // "Apr"
            day: 'numeric', // "24"
            hour: '2-digit', // "10"
            minute: '2-digit', // "30"
            hour12: true, // Use AM/PM
        });
    };

    return (
        <div>
            <h2>View Reservation</h2>
            <input
                type="text"
                placeholder="Enter reservation number"
                value={reservationNo}
                onChange={(e) => setReservationNo(e.target.value)}
            />
            <button onClick={fetchReservation}>Search Reservation</button>

            {error && <p>{error}</p>}

            {reservation && (
                <div>
                    <h3>Reservation Details</h3>
                    <p><strong>Reservation No:</strong> {reservation.Reservation_no}</p>
                    <p><strong>Customer ID:</strong> {reservation.Customer_ID}</p>
                    <p><strong>Table Number:</strong> {reservation.Table_number}</p>
                    <p><strong>Parking Spot:</strong> {reservation.Parking_spot}</p>
                    <p><strong>Time In:</strong> {formatTime(reservation.Time_in)}</p>
                    <p><strong>Time Out:</strong> {formatTime(reservation.Time_out)}</p>
                    <p><strong>Number of Guests:</strong> {reservation.Number_Guests}</p>

                    <button onClick={deleteReservation}>Delete Reservation</button>
                </div>
            )}
        </div>
    );
};

export default ViewReservation;
