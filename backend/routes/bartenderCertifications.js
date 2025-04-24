import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Route to get bartender certification by EID
router.get("/:eid", (req, res) => {
    const query = "SELECT * FROM Bartender_certificates WHERE EID = ?";
    db.query(query, [req.params.eid], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "Certification not found" });
        res.json(results[0]);
    });
});

// Route to update bartender certification by EID
router.put("/:eid", (req, res) => {
    const { Expiry_Date, Certificate_URL } = req.body;
    const query = `
        UPDATE Bartender_certificates 
        SET Expiry_Date = ?, Certificate_URL = ?
        WHERE EID = ?
    `;
    db.query(query, [Expiry_Date, Certificate_URL, req.params.eid], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Certification updated successfully!" });
    });
});

// Route to create a bartender certification
router.post("/", (req, res) => {
    const { EID, Expiry_Date, Certificate_URL } = req.body;
    const query = `
        INSERT INTO Bartender_certificates (EID, Expiry_Date, Certificate_URL)
        VALUES (?, ?, ?)
    `;
    db.query(query, [EID, Expiry_Date, Certificate_URL], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "Certification created successfully!" });
    });
});


export default router;
