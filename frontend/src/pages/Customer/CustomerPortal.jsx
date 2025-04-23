import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerReservation from './CustomerReservations';
import ViewReservation from './viewReservation';
import Menu from './menu';
import CustomerParking from './CustomerParking'; // ✅ Import the actual parking component
import './CustomerPortal.css';

const CustomerPage = () => {
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className="customer-page">
            <Link to="/" className="close-btn">&times;</Link>
            <h1 className="customer-portal-title">Customer Portal</h1>

            {/* Tabs */}
            <div className="customer-tabs">
                <button 
                    className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => setActiveTab('menu')}
                >
                    Menu Items
                </button>
                <button 
                    className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservations')}
                >
                    Make Reservation
                </button>
                <button 
                    className={`tab ${activeTab === 'parking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('parking')}
                >
                    Parking Available
                </button>
                <button 
                    className={`tab ${activeTab === 'viewEdit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewEdit')}
                >
                    View/Edit Reservation
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'menu' && <Menu />}
                {activeTab === 'reservations' && <CustomerReservation />}
                {activeTab === 'viewEdit' && <ViewReservation />}
                {activeTab === 'parking' && <CustomerParking />} {/* ✅ Show the parking table */}
            </div>
        </div>
    );
};

export default CustomerPage;
