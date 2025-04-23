import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerReservation.css';

const CustomerReservations = () => {
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [tables, setTables] = useState([]);
    const [reservations, setReservations] = useState([]);

    // Form Fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [guests, setGuests] = useState('');

    const timeSlots = Array.from({ length: 12 }, (_, i) => {
        const hour = 11 + i;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const suffix = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:00 ${suffix}`;
    });

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get("http://localhost:8800/RestaurantTable");
                setTables(res.data);
            } catch (err) {
                console.error("Failed to fetch tables:", err);
            }
        };

        const fetchReservations = async () => {
            try {
                const res = await axios.get("http://localhost:8800/reservations");
                setReservations(res.data);
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
            }
        };

        fetchTables();
        fetchReservations();
    }, []);

    const isFormValid = selectedTime && selectedTable && name && phone && guests;

    const convertTo24Hour = (time) => {
        const [t, modifier] = time.split(" ");
        let [hours, minutes] = t.split(":");
        hours = parseInt(hours);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    const isTableReservedAtTime = (tableNumber) => {
        const selectedTime24h = convertTo24Hour(selectedTime);
        return reservations.some(res => {
            const resTime = new Date(res.Time_in).toTimeString().slice(0, 5);
            return (
                res.Table_number === tableNumber &&
                resTime === selectedTime24h
            );
        });
    };

    const calculateTimeOut = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        minutes = parseInt(minutes);

        const now = new Date();
        const timeIn = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0));
        const timeOut = new Date(timeIn.getTime() + 2 * 60 * 60 * 1000);

        return { timeIn, timeOut };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const customerRes = await axios.post("http://localhost:8800/customer", {
                name,
                phone,
            });

            const customerID = customerRes.data.Customer_ID;
            const { timeIn, timeOut } = calculateTimeOut(selectedTime);

            const reservationData = {
                Customer_ID: customerID,
                Table_number: selectedTable,
                Time_in: timeIn.toISOString(),
                Time_out: timeOut.toISOString(),
                Number_Guests: guests,
            };

            console.log("Reservation Payload:", reservationData);

            const res = await axios.post("http://localhost:8800/reservations", reservationData);

            alert(`Reservation confirmed at ${selectedTime} for Table ${selectedTable}.
Name: ${name}
Phone: ${phone}
Guests: ${guests}
Reservation ID: ${res.data.reservation_id}`);

            window.location.href = '/';
        } catch (err) {
            console.error("Error submitting reservation:", err);
            alert("There was a problem submitting your reservation.");
        }
    };

    return (
        <div className="reservation-section">
            <h2>Select Reservation Time</h2>
            <form className="reservation-form" onSubmit={handleSubmit}>
                <div className="time-grid">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            type="button"
                            className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedTime(time);
                                setSelectedTable(null);
                            }}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {selectedTime && (
                    <>
                        <h3 className="select-table-heading">Select Table</h3>
                        <div className="table-grid">
                            {tables.map((table) => {
                                const reserved = isTableReservedAtTime(table.Table_number);
                                return (
                                    <button
                                        key={table.Table_number}
                                        type="button"
                                        className={`table-btn 
                                            ${selectedTable === table.Table_number ? 'selected' : ''} 
                                            ${reserved ? 'disabled' : ''}`}
                                        onClick={() => {
                                            if (!reserved) setSelectedTable(table.Table_number);
                                        }}
                                        disabled={reserved}
                                    >
                                        Table {table.Table_number}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {selectedTime && selectedTable && (
                    <>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your phone number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Number of Guests:</label>
                            <input
                                type="number"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                min="1"
                                max="20"
                                required
                            />
                        </div>
                    </>
                )}

                {selectedTime && (
                    <button type="submit" className="submit-btn" disabled={!isFormValid}>
                        Book Reservation
                    </button>
                )}
            </form>
        </div>
    );
};

export default CustomerReservations;
