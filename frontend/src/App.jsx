import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import EmployeePage from './pages/EmployeePage';

const App = () => {
    return (
        <Router>
            <div className="landing-page">
                <header className="header">
                    <h1>Welcome to Restauranteur</h1>
                    <p>As a valued customer, view our available menu items and book a reservation in advance.</p>
                    <p>As a valued employee, get signed in and log your hours view/edit your information, and view available inventory.</p>
                    
                    <div className="button-container">
                        <Link to="/customer">
                            <button className="customer-button">
                                Customer Portal
                            </button>
                        </Link>
                        <Link to="/employee">
                            <button className="employee-button">
                                Employee Portal
                            </button>
                        </Link>
                    </div>
                </header>

                <Routes>
                    <Route path="/customer" element={<CustomerPage />} />
                    <Route path="/employee" element={<EmployeePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;