import React, { useEffect, useState } from "react";
import axios from "axios";
import RestockLedger from './EmployeeRestock';
import './EmployeeInventory.css'; 

const EmployeeInventory = () => {
    const [ingredients, setIngredients] = useState([]);
    const [showLedger, setShowLedger] = useState(false); // 🔁 Toggle state

    useEffect(() => {
        if (!showLedger) { // Only fetch inventory if you're not in the ledger view
            const fetchInventory = async () => {
                try {
                    const res = await axios.get("http://localhost:8800/inventory");
                    setIngredients(res.data);
                } catch (err) {
                    console.error("Failed to fetch inventory", err);
                }
            };
            fetchInventory();
        }
    }, [showLedger]); // refetch when ledger closes

    const handleQuantityChange = async (ingredientId, newQuantity) => {
        try {
            console.log("Updating Ingredient_ID:", ingredientId);
            setIngredients((prevIngredients) =>
                prevIngredients.map((item) =>
                    item.Ingredient_ID === ingredientId
                        ? { ...item, Quantity: newQuantity }
                        : item
                )
            );

            await axios.put(`http://localhost:8800/inventory/${ingredientId}`, {
                quantity: newQuantity,
            });
        } catch (err) {
            console.error("Failed to update quantity", err);
        }
    };

    const getStatus = (quantity) => {
        if (quantity > 20) return "In Stock";
        if (quantity > 5) return "Low Stock";
        return "Critical";
    };

    const handleToggleLedger = () => {
        setShowLedger(!showLedger);
    };

    return (
        <div className="inventory-section">
            {!showLedger ? (
                <>
                    <h2>Restaurant Inventory</h2>
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((item) => (
                                <tr key={item.Ingredient_ID}>
                                    <td>{item.Ingredient_ID}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.Category}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.Quantity}
                                            min="0"
                                            onChange={(e) =>
                                                handleQuantityChange(item.Ingredient_ID, parseInt(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td>{getStatus(item.Quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="request-button" onClick={handleToggleLedger}>
                        View Restock Ledger
                    </button>
                </>
            ) : (
                <RestockLedger onBack={handleToggleLedger} />
            )}
        </div>
    );
};

export default EmployeeInventory;
