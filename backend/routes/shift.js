import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all shifts
router.get("/", (req, res) => {
    const q = "SELECT * FROM Shifts"; // Query to get all shift records
    db.query(q, (err, data) => {
        if (err) {
            console.error("Error fetching shifts:", err);
            return res.status(500).json({ error: "Failed to fetch shifts" });  // Return error if query fails
        }
        return res.json(data);  // Return all shift records
    });
});

// Add shift
router.post("/", (req, res) => {
    const { employeeId, TimeIn, TimeOut, Notes } = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    const query = `
        INSERT INTO Shifts (EID, TimeIn, TimeOut, Notes)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [employeeId, TimeIn, TimeOut, Notes], (err, result) => {
        if (err) {
            console.error("Error inserting shift", err);
            return res.status(500).json({ error: 'Failed to insert shift' });
        }
        res.status(201).json({ message: 'Shift successfully added' });
    });
});

// Get shifts for a specific employee
router.get("/:employeeId", (req, res) => {
    const employeeId = req.params.employeeId;
    const q = `
        SELECT Shift_ID, EID, TimeIn, TimeOut, Notes, 
               TIMESTAMPDIFF(HOUR, TimeIn, TimeOut) AS HoursWorked
        FROM Shifts
        WHERE EID = ?
    `;
    
    db.query(q, [employeeId], (err, data) => {
        if (err) {
            console.error("Error fetching shifts:", err);
            return res.status(500).json(err);
        }
        res.json(data);
    });
});

// Delete shift
router.delete("/:id", (req, res) => {
    const q = "DELETE FROM Shifts WHERE Shift_ID = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Shift deleted.");
    });
});

export default router;
