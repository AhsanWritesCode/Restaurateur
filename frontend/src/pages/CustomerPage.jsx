import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CustomerPage = () => {
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className="customer-page">
            <h1>Customer Portal</h1>
            
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
            </div>

            <div className="tab-content">
                {activeTab === 'menu' && (
                    <div className="menu-section">
                        <h2>Our Menu</h2>
                        <p>Menu items will be displayed here...</p>
                    </div>
                )}

                {activeTab === 'reservations' && (
                    <div className="reservation-section">
                        <h2>Make a Reservation</h2>
                        <form className="reservation-form">
                            <div className="form-group">
                                <label>Name:</label>
                                <input type="text" placeholder="Your name" />
                            </div>
                            <div className="form-group">
                                <label>Date:</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Time:</label>
                                <input type="time" />
                            </div>
                            <div className="form-group">
                                <label>Number of Guests:</label>
                                <input type="number" min="1" max="20" />
                            </div>
                            <button type="submit">Book Reservation</button>
                        </form>
                    </div>
                )}

                {activeTab === 'parking' && (
                    <div className="parking-section">
                        <h2>Available Parking</h2>
                        <p>Parking information will be displayed here...</p>
                    </div>
                )}
            </div>

            <Link to="/" className="back-link">Close</Link>
        </div>
    );
};

export default CustomerPage;