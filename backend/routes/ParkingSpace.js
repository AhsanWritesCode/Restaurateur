import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all parking spaces
router.get("/", (req, res) => {
    const q = "SELECT * FROM ParkingSpace";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to fetch parking spaces" });
        return res.json(data);
    });
});

// POST new parking space
router.post("/", (req, res) => {
    const { Space_number, Type, Vacancy } = req.body;
    const q = "INSERT INTO ParkingSpace (Space_number, Type, Vacancy) VALUES (?, ?, ?)";
    db.query(q, [Space_number, Type, Vacancy], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to add parking space" });
        return res.status(201).json({ message: "Parking space added successfully" });
    });
});

// PUT update vacancy for a space
router.put("/:space_number", (req, res) => {
    const { space_number } = req.params;
    const { Vacancy } = req.body;
    const q = "UPDATE ParkingSpace SET Vacancy = ? WHERE Space_number = ?";
    db.query(q, [Vacancy, space_number], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to update vacancy" });
        return res.json({ message: "Parking space updated successfully" });
    });
});

// DELETE parking space
router.delete("/:space_number", (req, res) => {
    const { space_number } = req.params;
    const q = "DELETE FROM ParkingSpace WHERE Space_number = ?";
    db.query(q, [space_number], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to delete parking space" });
        return res.json({ message: "Parking space deleted successfully" });
    });
});

export default router;
