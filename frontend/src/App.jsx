import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import EmployeePage from './pages/EmployeePage';
import HomePage from './pages/HomePage';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/customer" element={<CustomerPage />} />
                    <Route path="/employee" element={<EmployeePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;