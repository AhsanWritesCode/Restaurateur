import React, { useEffect } from 'react';
import axios from 'axios';

const EmployeeTables = ({ tables, setTables, newTable, setNewTable }) => {


    // Fetch all tables from the backend
    const refreshTables = async () => {
        try {
            const res = await axios.get("http://localhost:8800/RestaurantTable");
            setTables(res.data);
        } catch (err) {
            console.error("Failed to fetch tables", err);
        }
    };

    // Run once on mount to fetch table data
    useEffect(() => {
        refreshTables();
    }, []);

     // Handle adding a new table
    const handleAddTable = async () => {
        try {
            await axios.post("http://localhost:8800/RestaurantTable", {
                tableNumber: parseInt(newTable.tableNumber),
                vacancy: parseInt(newTable.vacancy)
            });
            alert("Table added!");
            setNewTable({ tableNumber: '', vacancy: 1 });
            refreshTables();
        } catch (err) {
            console.error("Add table failed", err);
        }
    };

    // Handle deleting a table by table number
    const handleDeleteTable = async (tableNumber) => {
        try {
            await axios.delete(`http://localhost:8800/RestaurantTable/${tableNumber}`);
            alert("Table deleted!");
            refreshTables();
        } catch (err) {
            console.error("Delete table failed", err);
        }
    };

    // Handle toggling a table's vacancy status
    const handleToggleVacancy = async (tableNumber, currentVacancy) => {
        try {
            await axios.put(`http://localhost:8800/RestaurantTable/${tableNumber}`, {
                vacancy: currentVacancy ? 0 : 1
            });
            refreshTables();
        } catch (err) {
            console.error("Toggle failed", err.response?.data || err.message);
        }
    };

    return (
        <div className="view-tables-section">
            <h2>Restaurant Tables</h2>

            {/* Add Table */}
            <div className="add-table-form">
                <input
                    type="number"
                    placeholder="Table Number"
                    value={newTable.tableNumber}
                    onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                />
                <select
                    value={newTable.vacancy}
                    onChange={(e) => setNewTable({ ...newTable, vacancy: e.target.value })}
                >
                    <option value={1}>Available</option>
                    <option value={0}>Occupied</option>
                </select>
                <button onClick={handleAddTable}>Add Table</button>
            </div>

            {/* Table List */}
            <table className="table-table">
                <thead>
                    <tr>
                        <th>Table Number</th>
                        <th>Vacancy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table, index) => (
                        <tr key={index}>
                            <td>{table.Table_number}</td>
                            <td>{table.Vacancy ? "Available" : "Occupied"}</td>
                            <td>
                                <button onClick={() => handleToggleVacancy(table.Table_number, table.Vacancy)}>Toggle Vacancy</button>
                                <button onClick={() => handleDeleteTable(table.Table_number)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTables;
