import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogHours = ({ shiftData, setShiftData, employeeId }) => {
    const [shifts, setShifts] = useState([]);

    // Fetch previous shifts for the user
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/shifts/${employeeId}`);
                console.log("Fetched Shifts:", res.data); // Log the fetched shifts
                setShifts(res.data);
            } catch (err) {
                console.error("Failed to fetch shifts", err);
            }
        };
    
        if (employeeId) {
            fetchShifts();
        }
    }, [employeeId]);

    // Handle submitting a new shift
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if employeeId exists
        console.log("Employee ID before submitting:", employeeId);  // <-- Add this log
    
        try {
            const timeIn = `${shiftData.date} ${shiftData.startTime}`;
            const timeOut = `${shiftData.date} ${shiftData.endTime}`;
     
            if (!shiftData.date || !shiftData.startTime || !shiftData.endTime) {
                alert("Please fill out all fields!");
                return;
            }
     
            // Send POST request
            await axios.post("http://localhost:8800/shifts", {
                employeeId,    // Ensure employeeId is passed
                TimeIn: timeIn,
                TimeOut: timeOut,
                Notes: shiftData.notes
            });
    
            alert("Shift submitted!");
            setShiftData({ date: '', startTime: '', endTime: '', notes: '' });
        } catch (err) {
            alert("Failed to submit shift.");
            console.error("Error details:", err.response ? err.response.data : err);
        }
    };

    // Handle delete shift
    const handleDelete = async (shiftId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this shift?");
        if (confirmDelete) {
            try {
                // Send DELETE request to remove the shift
                await axios.delete(`http://localhost:8800/shifts/${shiftId}`);
                setShifts(shifts.filter((shift) => shift.Shift_ID !== shiftId)); // Remove from state
                alert("Shift deleted successfully!");
            } catch (err) {
                alert("Failed to delete shift.");
                console.error("Error details:", err.response ? err.response.data : err);
            }
        }
    };

    return (
        <div className="hours-section">
            <h2>Log Your Hours</h2>
            <form className="hours-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        required
                        value={shiftData.date}
                        onChange={(e) => setShiftData({ ...shiftData, date: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        required
                        value={shiftData.startTime}
                        onChange={(e) => setShiftData({ ...shiftData, startTime: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        required
                        value={shiftData.endTime}
                        onChange={(e) => setShiftData({ ...shiftData, endTime: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Notes:</label>
                    <textarea
                        value={shiftData.notes}
                        onChange={(e) => setShiftData({ ...shiftData, notes: e.target.value })}
                    ></textarea>
                </div>
                <button type="submit">Submit Hours</button>
            </form>

            <h3>Your Previously Logged Shifts</h3>
            <table>
                <thead>
                    <tr>
                        <th></th> {/* Add a "Delete" column */}
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Hours Worked</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((shift) => (
                        <tr key={shift.Shift_ID}>
                            {/* Delete button */}
                            <td>
                                <button onClick={() => handleDelete(shift.Shift_ID)}>Delete</button>
                            </td>
                            {/* Formatting Date and Time */}
                            <td>{new Date(shift.TimeIn).toLocaleDateString()}</td>
                            <td>{new Date(shift.TimeIn).toLocaleTimeString()}</td>
                            <td>{new Date(shift.TimeOut).toLocaleTimeString()}</td>
                            <td>{shift.HoursWorked}</td>
                            <td>{shift.Notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogHours;
