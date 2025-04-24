import express from 'express';
import { db } from '../db.js';

const router = express.Router(); // ✅ Initialize the router

// GET suppliers-with-items
router.get('/suppliers-with-items', (req, res) => {
    const supplierQuery = `
        SELECT s.BusinessNumber, s.Name AS SupplierName, s.PhoneNumber, s.Email, 
               i.Ingredient_ID, i.Name AS ItemName
        FROM Supplier s
        JOIN Supplied_By sb ON s.BusinessNumber = sb.BusinessNumber
        JOIN Ingredients i ON sb.Ingredient_ID = i.Ingredient_ID
        ORDER BY s.BusinessNumber;
    `;

    db.query(supplierQuery, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const grouped = {};
        results.forEach(row => {
            if (!grouped[row.BusinessNumber]) {
                grouped[row.BusinessNumber] = {
                    BusinessNumber: row.BusinessNumber,
                    Name: row.SupplierName,
                    PhoneNumber: row.PhoneNumber,
                    Email: row.Email,
                    Items: [],
                };
            }
            grouped[row.BusinessNumber].Items.push({
                Ingredient_ID: row.Ingredient_ID,
                Name: row.ItemName,
            });
        });

        res.json(Object.values(grouped));
    });
});

// POST add in a new ingredient to the db
router.post('/', (req, res) => {
    const { Ingredient_ID, BusinessNumber, QuantityRequested } = req.body;

    if (!Ingredient_ID || !BusinessNumber || !QuantityRequested) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO Restock_Ledger (Ingredient_ID, BusinessNumber, QuantityRequested)
        VALUES (?, ?, ?)
    `;

    db.query(query, [Ingredient_ID, BusinessNumber, QuantityRequested], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Restock request added", requestId: result.insertId });
    });
});

// GET pulls stock request data from the Restock ledger and joins with the Ingredients table and the supplier table to get ingredient name ansupplier name
router.get('/', (req, res) => {
    const query = `
        SELECT rl.Request_ID, rl.Ingredient_ID, i.Name AS IngredientName,
               rl.BusinessNumber, s.Name AS SupplierName,
               rl.QuantityRequested, rl.RequestDate, rl.Status
        FROM Restock_Ledger rl
        JOIN Ingredients i ON rl.Ingredient_ID = i.Ingredient_ID
        JOIN Supplier s ON rl.BusinessNumber = s.BusinessNumber
        ORDER BY rl.RequestDate DESC;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// PUT change the restock ledger status
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    if (!['Pending', 'Approved', 'Delivered'].includes(Status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const query = `
        UPDATE Restock_Ledger
        SET Status = ?
        WHERE Request_ID = ?
    `;

    db.query(query, [Status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status updated" });
    });
});

export default router;
