import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerHistory = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');

    // Fetch customers when component mounts
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:8800/customer'); 
                setCustomers(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch customer data');
            }
        };

        fetchCustomers();
    }, []);

    // Handler to delete all customers' data
    const deleteAllCustomers = async () => {
        try {
            const response = await axios.delete('http://localhost:8800/customer'); 
            alert(response.data.message); // Success message from backend
            setCustomers([]); // Clear the customers in UI
        } catch (err) {
            alert('Uh-oh, failed to delete all customer data.');
        }
    };

    return (
        <div>
            <h2>Customer History</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <ul>
                    {customers.map((customer) => (
                        <li key={customer.Customer_ID}>
                            <div>
                                <p><strong>Customer ID:</strong> {customer.Customer_ID}</p>
                                <p><strong>Name:</strong> {customer.Name}</p>
                                <p><strong>Phone:</strong> {customer.Phone_number}</p>
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={deleteAllCustomers} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'red', color: 'white' }}>
                Delete All Old Customer Data That Have No Live Reservations
            </button>
        </div>
    );
};

export default CustomerHistory;
