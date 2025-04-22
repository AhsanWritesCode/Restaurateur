import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerReservation from './CustomerReservations'; // ✅ Import it
import ViewReservation from './viewReservation';  // Importing as PascalCase
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
                {activeTab === 'menu' && (
                    <div className="menu-section">
                        <h2>Our Menu</h2>
                        <p>Menu items will be displayed here...</p>
                    </div>
                )}

                {activeTab === 'reservations' && <CustomerReservation />}

                {activeTab === 'viewEdit' && <ViewReservation />} {/* View/Edit Reservation tab */}

                {activeTab === 'parking' && (
                    <div className="parking-section">
                        <h2>Available Parking</h2>
                        <p><strong>50</strong> parking spots available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerPage;
