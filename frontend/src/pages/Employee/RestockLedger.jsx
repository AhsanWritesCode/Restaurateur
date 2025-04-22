import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RestockLedger = ({ onBack }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [ledger, setLedger] = useState([]);

    useEffect(() => {
        fetchSuppliers();
        fetchLedger();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:8800/restock-ledger/suppliers-with-items")
            setSuppliers(res.data);
        } catch (err) {
            console.error('Error fetching suppliers', err);
        }
    };

    const fetchLedger = async () => {
        try {
            const res = await axios.get("http://localhost:8800/restock-ledger"); // ✅ Correct endpoint
            setLedger(res.data);
        } catch (err) {
            console.error('Error fetching ledger', err);
        }
    };
    
    const createOrder = async (ingredientId, businessNumber, name) => {
        const quantity = prompt(`Enter quantity for ${name}:`);
        if (!quantity || isNaN(quantity) || parseInt(quantity) < 1) {
            alert("Please enter a valid quantity greater than 0.");
            return;
        }
    
        try {
            await axios.post("http://localhost:8800/restock-ledger", { // ✅ Correct endpoint
                Ingredient_ID: ingredientId,
                BusinessNumber: businessNumber,
                QuantityRequested: parseInt(quantity),
            });
            fetchLedger(); // refresh ledger after creating order
        } catch (err) {
            console.error('Error creating order', err);
        }
    };
    

    const updateStatus = async (requestId, newStatus) => {
        try {
            await axios.put(`http://localhost:8800/restock-ledger/${requestId}`, {
                Status: newStatus,
            });
            fetchLedger(); // refresh ledger after status update
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    return (
        <div className="restock-ledger">
            <h2>Restock Ledger</h2>
            <button onClick={onBack}>← Back to Inventory</button>

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
