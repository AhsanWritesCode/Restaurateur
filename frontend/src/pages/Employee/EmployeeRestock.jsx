import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeRestock.css';

// This component displays the restock ledger and lets employees place restock orders
const RestockLedger = ({ onBack }) => {
    // State to hold the list of suppliers and their items
    const [suppliers, setSuppliers] = useState([]);

    // State to hold all restock requests in the ledger
    const [ledger, setLedger] = useState([]);

    // Fetch suppliers and the current ledger once on component mount
    useEffect(() => {
        fetchSuppliers();
        fetchLedger();
    }, []);

    // Fetch all suppliers along with the ingredients they supply
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:8800/restock-ledger/suppliers-with-items");
            setSuppliers(res.data);
        } catch (err) {
            console.error('Error fetching suppliers', err);
        }
    };

    // Fetch all current restock requests in the ledger
    const fetchLedger = async () => {
        try {
            const res = await axios.get("http://localhost:8800/restock-ledger");
            setLedger(res.data);
        } catch (err) {
            console.error('Error fetching ledger', err);
        }
    };

    // Create a restock order for a specific ingredient and supplier
    const createOrder = async (ingredientId, businessNumber, name) => {
        const quantity = prompt(`Enter quantity for ${name}:`);
        
        // Validate the entered quantity
        if (!quantity || isNaN(quantity) || parseInt(quantity) < 1) {
            alert("Please enter a valid quantity greater than 0.");
            return;
        }

        try {
            await axios.post("http://localhost:8800/restock-ledger", {
                Ingredient_ID: ingredientId,
                BusinessNumber: businessNumber,
                QuantityRequested: parseInt(quantity),
            });
            fetchLedger(); // Refresh ledger after creating the order
        } catch (err) {
            console.error('Error creating order', err);
        }
    };

    // Update the status of a restock request
    const updateStatus = async (requestId, newStatus) => {
        try {
            await axios.put(`http://localhost:8800/restock-ledger/${requestId}`, {
                Status: newStatus,
            });
            fetchLedger(); // Refresh ledger after updating the status
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    return (
        <div className="restock-ledger">
            <h2>Restock Ledger</h2>
            <button onClick={onBack}>← Back to Inventory</button>

            {/* Section to list all suppliers and their items */}
            <h3>Suppliers</h3>
            {suppliers.map((supplier) => (
                <div key={supplier.BusinessNumber} className="supplier-block">
                    <h4>{supplier.Name}</h4>
                    <p>Phone: {supplier.PhoneNumber} | Email: {supplier.Email}</p>
                    <ul>
                        {supplier.Items.map((item) => (
                            <li key={item.Ingredient_ID}>
                                {item.Name}
                                <button
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() =>
                                        createOrder(item.Ingredient_ID, supplier.BusinessNumber, item.Name)
                                    }
                                >
                                    Create Order
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Section to show current restock requests */}
            <h3>Current Restock Requests</h3>
            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Ingredient</th>
                        <th>Supplier</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {ledger.map((entry) => (
                        <tr key={entry.Request_ID}>
                            <td>{entry.Request_ID}</td>
                            <td>{entry.IngredientName}</td>
                            <td>{entry.SupplierName}</td>
                            <td>{entry.QuantityRequested}</td>
                            <td>{new Date(entry.RequestDate).toLocaleString()}</td>
                            <td>
                                <select
                                    value={entry.Status}
                                    onChange={(e) => updateStatus(entry.Request_ID, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RestockLedger;
