import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerReservation.css';

const CustomerReservations = () => {
    const [selectedDate, setSelectedDate] = useState(''); // The selected reservation date
    const [selectedTime, setSelectedTime] = useState(''); // The selected reservation time
    const [selectedTable, setSelectedTable] = useState(null); // The selected table number
    const [tables, setTables] = useState([]); // Available tables for booking
    const [reservations, setReservations] = useState([]); // Existing reservations

    // Form fields
    const [name, setName] = useState(''); // Customer name
    const [phone, setPhone] = useState(''); // Customer phone number
    const [guests, setGuests] = useState(''); // Number of guests

    // Time slots for reservation (11AM to 10PM)
    const timeSlots = Array.from({ length: 12 }, (_, i) => {
        const hour = 11 + i;
        const displayHour = hour > 12 ? hour - 12 : hour; // Convert hour to 12-hour format
        const suffix = hour >= 12 ? 'PM' : 'AM'; // Set AM/PM suffix
        return `${displayHour}:00 ${suffix}`; // Return formatted time string
    });

    // Fetch tables and reservations when component mounts
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get("http://localhost:8800/RestaurantTable");
                setTables(res.data); // Update tables state with fetched data
            } catch (err) {
                console.error("Failed to fetch tables:", err); // Handle fetch error
            }
        };

        const fetchReservations = async () => {
            try {
                const res = await axios.get("http://localhost:8800/reservations");
                setReservations(res.data); // Update reservations state with fetched data
            } catch (err) {
                console.error("Failed to fetch reservations:", err); // Handle fetch error
            }
        };

        fetchTables();
        fetchReservations();
    }, []);

    // Check if the form is valid
    const isFormValid = selectedDate && selectedTime && selectedTable && name && phone && guests;

    // Convert time from 12-hour format to 24-hour format (e.g. 1:00 PM -> 13:00)
    const convertTo24Hour = (time) => {
        const [t, modifier] = time.split(" ");
        let [hours, minutes] = t.split(":");
        hours = parseInt(hours);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`; // Return time in 24-hour format
    };

    // Check if the selected table is reserved at the selected time
    const isTableReservedAtTime = (tableNumber) => {
        const selectedTime24h = convertTo24Hour(selectedTime); // Convert selected time to 24-hour format
        const selectedDateStr = selectedDate; // Store selected date as string (YYYY-MM-DD)
        
        const selectedDateTime = new Date(`${selectedDateStr}T${selectedTime24h}:00`); // Create Date object for selected time

        console.log(`🔍 Checking if table ${tableNumber} is reserved at ${selectedDateStr} ${selectedTime24h}`);
        
        return reservations.some((res) => {
            const resDate = new Date(res.Time_in);  // Reservation start time
            const resEndDate = new Date(res.Time_out);  // Reservation end time
            const resDateStr = resDate.toISOString().split('T')[0]; // Get reservation date

            // Convert reservation start time and end time to local time strings
            const resStartTime = resDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const resEndTime = resEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            // Check if the selected time overlaps with the reservation time range
            const isTimeOverlapping = (selectedDateTime >= resDate && selectedDateTime < resEndDate);

            return (
                res.Table_number === tableNumber && // Table number matches
                resDateStr === selectedDateStr && // Reservation date matches
                isTimeOverlapping // Time overlap check
            );
        });
    };

    // Calculate reservation end time based on 2-hour duration
    const calculateTimeOut = (dateStr, timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        minutes = parseInt(minutes);
    
        const [year, month, day] = dateStr.split('-').map(Number);
        const timeIn = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0)); // Create Date object for time in
        const timeOut = new Date(timeIn.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours to time in to get time out
    
        return { timeIn, timeOut }; // Return both time in and time out
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return; // If form is not valid, do nothing

        try {
            const customerRes = await axios.post("http://localhost:8800/customer", {
                name,
                phone,
            });

            const customerID = customerRes.data.Customer_ID;
            
            const { timeIn, timeOut } = calculateTimeOut(selectedDate, selectedTime);

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

            window.location.href = '/'; // Redirect to home page after successful reservation
        } catch (err) {
            console.error("Error submitting reservation:", err);
            alert("There was a problem submitting your reservation.");
        }
    };

    return (
        <div className="reservation-section">
            <h2>Select Reservation Date</h2>
            <form className="reservation-form" onSubmit={handleSubmit}>
                <div className="date-picker">
                    <label htmlFor="reservation-date">Choose a date:</label>
                    <input
                        type="date"
                        id="reservation-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                    />
                </div>

                {selectedDate && (
                    <>
                        <h3>Select Reservation Time</h3>
                        <div className="time-grid">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedTime(time);
                                        setSelectedTable(null);  // Reset table when time is changed
                                    }}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </>
                )}

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
                                            if (!reserved) setSelectedTable(table.Table_number); // Set selected table if not reserved
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
