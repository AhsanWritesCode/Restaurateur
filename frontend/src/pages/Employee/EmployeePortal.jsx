import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeePortal.css'; 

import EmployeeLogin from './EmployeeLogin';
import EmployeeTabs from './EmployeeTabs';
import LogHours from './LogHours';
import EmployeeProfile from './EmployeeProfile';
import EmployeeInventory from './EmployeeInventory';
import EmployeeTables from './EmployeeTables';
import ManagerTools from './ManagerTools';

const EmployeePage = () => {
    const [activeTab, setActiveTab] = useState('signin');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        position: '',
        phoneNumber: '',
        password: ''
    });

    const [shiftData, setShiftData] = useState({ date: '', startTime: '', endTime: '', notes: '' });
    const [loginData, setLoginData] = useState({ employeeId: '', password: '' });
    const [employeeID, setEmployeeID] = useState(''); // Store the employeeId as a string
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState({ tableNumber: '', vacancy: 1 });

    //INFO WIP
    useEffect(() => {
        if (activeTab === 'profile') {
            refreshInfo();
        }
    }, [activeTab]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                name: employeeData.name,
                email: employeeData.email,
                position: employeeData.position,
                phoneNumber: employeeData.phoneNumber,
            };

            if (employeeData.password.trim() !== '') {
                updatePayload.password = employeeData.password;
            }

            console.log("Sending update payload:", updatePayload);

            await axios.put(`http://localhost:8800/employees/${employeeID}`, updatePayload);

            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update info failed", err);
            alert("Failed to update profile.");
        }
    };

    const refreshInfo = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/employees/${employeeID}`);
            setEmployeeData({
                name: res.data.Name,
                email: res.data.Email,
                position: res.data.Role,
                phoneNumber: res.data.Phone_number,
                password: ''
            });
        } catch (err) {
            console.error("Failed to fetch employee data", err);
        }
    };

    //LOGIN LOGOUT =======================================
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8800/employee/login', loginData);
            const emp = res.data.employee; // 👈 pull from correct spot

            console.log("Employee Role:", emp.Role); // confirm it's Admin or Manager
            setEmployeeData({
                name: emp.Name,
                email: emp.Email,
                position: emp.Role,
                phoneNumber: emp.Phone_number,
                password: ''
            });

            setEmployeeID(emp.Employee_ID); // Store the employeeId
            setIsLoggedIn(true);
            setActiveTab('hours');
        } catch (err) {
            alert("Login failed. Please check your credentials.");
            console.error(err);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveTab('signin');
    };

    //========================================================

    return (
        <div className="employee-page">
            <Link to="/" className="close-btn">&times;</Link>
            <h1 className="employee-portal-title">Employee Portal</h1>

            {!isLoggedIn ? (
                <EmployeeLogin loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} />
            ) : (
                <>
                    <EmployeeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="tab-content">
                        {activeTab === 'hours' && (
                            <LogHours shiftData={shiftData} setShiftData={setShiftData} employeeId={employeeID} />
                        )}
                        {activeTab === 'profile' && (
                            <EmployeeProfile employeeData={employeeData} setEmployeeData={setEmployeeData} handleUpdate={handleUpdateInfo} />
                        )}
                        {activeTab === 'inventory' && (
                            <EmployeeInventory />
                        )}
                        {activeTab === 'viewTables' && <EmployeeTables
                            tables={tables}
                            setTables={setTables}
                            newTable={newTable}
                            setNewTable={setNewTable}
                        />}
                        {activeTab === 'managerTools' && (
                            <ManagerTools />
                        )}
                    </div>
                    
                    <div className="bottom-buttons">
                        {(employeeData.position === 'Admin' || employeeData.position === 'Manager') && (
                            <button onClick={() => setActiveTab('managerTools')} className="manager-button">
                                Manager Tools
                            </button>
                        )}
                        <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeePage;
