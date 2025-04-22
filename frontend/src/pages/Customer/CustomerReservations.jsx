import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerReservation.css';

const CustomerReservations = () => {
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [tables, setTables] = useState([]);

    // Form Fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [guests, setGuests] = useState('');
    const [wantsParking, setWantsParking] = useState(false);

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
        fetchTables();
    }, []);

    const isFormValid = selectedTime && selectedTable && name && phone && guests;

    // Helper function to calculate the Time_in and Time_out
    const calculateTimeOut = (timeStr) => {
        const [hourStr, minuteStr] = timeStr.split(":");
        const [hour, suffix] = hourStr.trim().split(" ");
        const isPM = suffix === 'PM';
        let hours = parseInt(hour);
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours -= 12;

        const timeIn = new Date();
        timeIn.setHours(hours);
        timeIn.setMinutes(parseInt(minuteStr.trim()));
        timeIn.setSeconds(0);

        // Assuming a 2-hour duration for the reservation
        const timeOut = new Date(timeIn);
        timeOut.setHours(timeIn.getHours() + 2);

        return { timeIn, timeOut };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
    
        try {
            // Step 1: Get or create customer
            const customerRes = await axios.post("http://localhost:8800/customer", {
                name,
                phone,
            });
    
            const customerID = customerRes.data.Customer_ID;
    
            // Step 2: Calculate Time_in and Time_out
            const { timeIn, timeOut } = calculateTimeOut(selectedTime);
    
            // Step 3: (Optional) You can add reservation logic here if needed later
    
            // Step 4: Book the reservation
            const parkingSpot = wantsParking ? 1 : null; // Assuming 1 if parking is selected, null otherwise
            const reservationData = {
                Customer_ID: customerID,
                Table_number: selectedTable,
                Parking_spot: parkingSpot,
                Time_in: timeIn.toISOString(),  // Convert to ISO format
                Time_out: timeOut.toISOString(), // Convert to ISO format
                Number_Guests: guests,
            };
    
            console.log("Reservation Payload:", reservationData);
            
            // Step 5: Send reservation data to create reservation
            const res = await axios.post("http://localhost:8800/reservations", reservationData);
    
            // Show confirmation with reservation ID
            alert(`Reservation confirmed at ${selectedTime} for Table ${selectedTable}.
    Name: ${name}
    Phone: ${phone}
    Guests: ${guests}
    Parking: ${wantsParking ? "Yes" : "No"}
    Reservation ID: ${res.data.reservation_id}`);
    
            // Optionally redirect the user to home page after booking
            window.location.href = '/';  // This will redirect to the home page
    
        } catch (err) {
            console.error("Error submitting reservation:", err);
            alert("There was a problem submitting your reservation.");
        }
    };

    return (
        <div className="reservation-section">
            <h2>Select Reservation Time</h2>
            <form className="reservation-form" onSubmit={handleSubmit}>
                {/* Time Buttons */}
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

                {/* Table Buttons */}
                {selectedTime && (
                    <>
                        <h3 className="select-table-heading">Select Table</h3>
                        <div className="table-grid">
                            {tables.map((table) => (
                                <button
                                    key={table.Table_number}
                                    type="button"
                                    className={`table-btn 
                                        ${selectedTable === table.Table_number ? 'selected' : ''} 
                                        ${table.Vacancy ? '' : 'disabled'}`}
                                    onClick={() => {
                                        if (table.Vacancy) setSelectedTable(table.Table_number);
                                    }}
                                    disabled={!table.Vacancy}
                                >
                                    Table {table.Table_number}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* User Info Form */}
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
                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={wantsParking}
                                    onChange={() => setWantsParking(!wantsParking)}
                                />
                                Opt-in for parking
                            </label>
                        </div>
                    </>
                )}

                {/* Submit Button */}
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
