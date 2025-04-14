import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeePage = () => {
    const [activeTab, setActiveTab] = useState('signin'); // default tab is signin
    const [isLoggedIn, setIsLoggedIn] = useState(false); // default isLoggedIn is false
    const [employeeData, setEmployeeData] = useState({ // default employee data
        name: '',
        email: '',
        position: '',
        phoneNumber: ''
    });

    const handleLogin = (e) => {
        e.preventDefault(); // prevents default form submission behaviour (page reload)
        setIsLoggedIn(true); // sets isLoggedIn to trues
        setEmployeeData({ // TODO - this is a placeholder, in final app we will fetch this data from the database

        });
    };

    const handleLogout = () => {
        setIsLoggedIn(false); // sets isLoggedIn to false
        setActiveTab('signin'); // resets active tab to signin
    };

    return (
        <div className="employee-page">
            <h1>Employee Portal</h1>
            
            {!isLoggedIn ? ( // if not logged in, show login form
                <div className="login-section">
                    <h2>Employee Sign In</h2>
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Employee ID:</label>
                            <input type="text" placeholder="Enter your ID" required />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" placeholder="Enter your password" required />
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            ) : ( // if logged in, show employee information and tabs
                <>
                    <div className="employee-tabs">
                        <button 
                            className={`tab ${activeTab === 'hours' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hours')}
                        >
                            Log Hours
                        </button>
                        <button 
                            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            My Information
                        </button>
                        <button 
                            className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inventory')}
                        >
                            Inventory
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'hours' && (
                            <div className="hours-section">
                                <h2>Log Your Hours</h2>
                                <form className="hours-form">
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <input type="date" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Start Time:</label>
                                        <input type="time" required />
                                    </div>
                                    <div className="form-group">
                                        <label>End Time:</label>
                                        <input type="time" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Notes:</label>
                                        <textarea placeholder="Any notes about your shift"></textarea>
                                    </div>
                                    <button type="submit">Submit Hours</button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="profile-section">
                                <h2>Your Information</h2>
                                <form className="profile-form">
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input type="text" value={employeeData.name} onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email:</label>
                                        <input type="email" value={employeeData.email} onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Position:</label>
                                        <input type="text" value={employeeData.position} onChange={(e) => setEmployeeData({...employeeData, position: e.target.value})} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number:</label>
                                        <input type="tel" value={employeeData.phoneNumber} onChange={(e) => setEmployeeData({...employeeData, phoneNumber: e.target.value})} />
                                    </div>
                                    <button type="submit">Update Information</button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'inventory' && ( 
                            <div className="inventory-section"> 
                                <h2>Restaurant Inventory</h2>
                                <table className="inventory-table"> {/* Placeholder table, real table will come from database */}
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Category</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Tomatoes</td>
                                            <td>Produce</td>
                                            <td>25 lbs</td>
                                            <td>In Stock</td>
                                        </tr>
                                        <tr>
                                            <td>Chicken</td>
                                            <td>Meat</td>
                                            <td>15 lbs</td>
                                            <td>Low Stock</td>

                                        </tr>
                                    </tbody>
                                </table>
                                <button className="request-button">Request Restock</button>
                            </div>
                        )}
                    </div>

                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                </>
            )}

            <Link to="/" className="back-link">Close</Link>
        </div>
    );
};

export default EmployeePage;

