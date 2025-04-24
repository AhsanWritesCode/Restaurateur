import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    // Fetch all reservations when component mounts
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get("http://localhost:8800/reservations");
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations 😞');
            }
        };

        fetchReservations();
    }, []);

    // Handler to delete a reservation
    const deleteReservation = async (reservationNo) => {
        try {
            const response = await axios.delete(`http://localhost:8800/reservations/${reservationNo}`);
            alert(response.data.message);
            setReservations((prev) => prev.filter(res => res.Reservation_no !== reservationNo));
        } catch (err) {
            alert('Uh-oh, failed to delete reservation.');
        }
    };

    // Helper to format timestamps nicely
    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div>
            <h2>Reservations List</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reservations.length === 0 ? (
                <p>No reservations found at the moment.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.Reservation_no}>
                            <div>
                                <p><strong>Reservation No:</strong> {reservation.Reservation_no}</p>
                                <p><strong>Customer ID:</strong> {reservation.Customer_ID}</p>
                                <p><strong>Table Number:</strong> {reservation.Table_number}</p>
                                <p><strong>Parking Spot:</strong> {reservation.Parking_spot}</p>
                                <p><strong>Time In:</strong> {formatDateTime(reservation.Time_in)}</p>
                                <p><strong>Time Out:</strong> {formatDateTime(reservation.Time_out)}</p>
                                <p><strong>Number of Guests:</strong> {reservation.Number_Guests}</p>

                                <button onClick={() => deleteReservation(reservation.Reservation_no)}>
                                    Delete Reservation
                                </button>
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomerReservations;
