import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="home-content">
                <div className="hero-section">
                    <h1>Welcome to Restauranteur</h1>
                    
                    <div className="portal-cards">
                        <Link to="/customer" className="portal-card customer-card">
                            <div className="card-content">
                                <h2>Customer Portal</h2>
                                <p>View our available menu items and book a reservation in advance</p>
                                <div className="card-button">Enter →</div>
                            </div>
                        </Link>
                        
                        <Link to="/employee" className="portal-card employee-card">
                            <div className="card-content">
                                <h2>Employee Portal</h2>
                                <p>Get signed in, log your hours, and view available inventory</p>
                                <div className="card-button">Enter →</div>
                            </div>
                        </Link>
                    </div>
                </div>
                
                <footer className="home-footer">
                    <p>© 2025 Restauranteur | Providing a high quality experience for both customers and employees</p>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;