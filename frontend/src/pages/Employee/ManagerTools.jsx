import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManagerTools.css';

const roleOptions = ['Admin', 'Manager', 'Bartender', 'Cook', 'Server'];



const ManagerTools = ({EID}) => {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'Server',
    });
    const [EmployeeID, setEID] = useState(EID);
    const [nextEmployeeId, setNextEmployeeId] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedShifts, setSelectedShifts] = useState([]);

    const currentEmployeeId = EmployeeID;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:8800/employees');
            setEmployees(res.data);
            const maxId = res.data.reduce((max, emp) => Math.max(max, emp.Employee_ID), 0);
            setNextEmployeeId(maxId + 1);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const { name, phone, password, role } = newEmployee;
        if (!name || !phone || !password || !role) return alert("All fields are required!");

        try {
            await axios.post('http://localhost:8800/employees', {
                Employee_ID: nextEmployeeId,
                Name: name,
                Phone_number: phone,
                Password: password,
                Role: role
            });
            fetchEmployees();
            setNewEmployee({ name: '', phone: '', password: '', role: 'Server' });
        } catch (err) {
            console.error('Failed to add employee:', err);
            alert("Failed to add employee.");
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (id === currentEmployeeId) {
            alert("You cannot delete yourself.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8800/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            console.error('Failed to delete employee:', err);
        }
    };

    const handleViewShifts = async (id) => {
        if (id === currentEmployeeId) return; // Prevent viewing your own shifts

        try {
            const res = await axios.get(`http://localhost:8800/shifts/${id}`);
            setSelectedEmployeeId(id);
            setSelectedShifts(res.data);
        } catch (err) {
            console.error('Failed to fetch shifts:', err);
        }
    };

    const handleDeleteShift = async (shiftId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this shift?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8800/shifts/${shiftId}`);
            setSelectedShifts((prev) => prev.filter((s) => s.Shift_ID !== shiftId));
        } catch (err) {
            console.error('Failed to delete shift:', err);
            alert("Failed to delete shift.");
        }
    };

    return (
        <div className="manager-tools">
            <h2>Employee Manager</h2>

            <form className="add-employee-form" onSubmit={handleAddEmployee}>
                <h3>Add New Employee</h3>
                {nextEmployeeId !== null && <p><strong>New Employee ID:</strong> {nextEmployeeId}</p>}
                <input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleInputChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" value={newEmployee.phone} onChange={handleInputChange} required />
                <input type="password" name="password" placeholder="Password" value={newEmployee.password} onChange={handleInputChange} required />
                <select name="role" value={newEmployee.role} onChange={handleInputChange} required>
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                <button type="submit">Add Employee</button>
            </form>

            <div className="employee-list">
                <h3>Current Employees</h3>
                {employees.length === 0 ? (
                    <p>No employees found.</p>
                ) : (
                    <ul>
                        {employees.map((emp) => (
                            <li key={emp.Employee_ID}>
                                <span>{emp.Name} - {emp.Role} - {emp.Phone_number}</span>
                                <button
                                    onClick={() => handleDeleteEmployee(emp.Employee_ID)}
                                    disabled={emp.Employee_ID === currentEmployeeId}
                                    title={emp.Employee_ID === currentEmployeeId ? "You can't remove yourself" : ""}
                                >
                                    Remove
                                </button>
                                {emp.Employee_ID !== currentEmployeeId && (
                                    <button onClick={() => handleViewShifts(emp.Employee_ID)}>View Shifts</button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedEmployeeId && (
                <div className="shift-table-section">
                    <h3>Shifts for Employee #{selectedEmployeeId}</h3>
                    <table className="log-hours-table">
                        <thead>
                            <tr>
                                <th>Delete</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Hours Worked</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedShifts.map((shift) => (
                                <tr key={shift.Shift_ID}>
                                    <td><button onClick={() => handleDeleteShift(shift.Shift_ID)}>Delete</button></td>
                                    <td>{new Date(shift.TimeIn).toLocaleDateString()}</td>
                                    <td>{new Date(shift.TimeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{new Date(shift.TimeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{shift.HoursWorked}</td>
                                    <td>{shift.Notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManagerTools;
