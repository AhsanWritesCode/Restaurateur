import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get("http://localhost:8800/reservations");
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations');
            }
        };

        fetchReservations();
    }, []);

    const deleteReservation = async (reservationNo) => {
        try {
            const response = await axios.delete(`http://localhost:8800/reservations/${reservationNo}`);
            alert(response.data.message); // Success message
            setReservations(reservations.filter(res => res.Reservation_no !== reservationNo)); // Remove reservation from the list
        } catch (err) {
            alert('Failed to delete reservation');
        }
    };

    return (
        <div>
            <h2>Reservations List</h2>

            {error && <p>{error}</p>}

            {reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.Reservation_no}>
                            <div>
                                <p><strong>Reservation No:</strong> {reservation.Reservation_no}</p>
                                <p><strong>Customer ID:</strong> {reservation.Customer_ID}</p>
                                <p><strong>Table Number:</strong> {reservation.Table_number}</p>
                                <p><strong>Parking Spot:</strong> {reservation.Parking_spot}</p>
                                <p><strong>Time In:</strong> {reservation.Time_in}</p>
                                <p><strong>Time Out:</strong> {reservation.Time_out}</p>
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
