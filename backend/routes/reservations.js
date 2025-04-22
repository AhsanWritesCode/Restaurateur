import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Route to get all reservations
router.get("/", (req, res) => {
    const query = "SELECT * FROM Reservation";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Failed to fetch reservations:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Create a reservation
router.post("/", (req, res) => {
    const { Customer_ID, Table_number, Parking_spot, Time_in, Time_out, Number_Guests } = req.body;

    const q = `
        INSERT INTO Reservation 
        (Customer_ID, Table_number, Parking_spot, Time_in, Time_out, Number_Guests)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [Customer_ID, Table_number, Parking_spot, Time_in, Time_out, Number_Guests];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Error creating reservation:", err);
            return res.status(500).json({ error: "Failed to create reservation" });
        }

        const reservationId = result.insertId;  // Get the generated reservation ID
        res.status(201).json({
            message: "Reservation created successfully",
            reservation_id: reservationId,  // Include reservation ID in the response
        });
    });
});

// Admin or employee: Get all reservations (redundant with "/" route, optional)
router.get("/all", (req, res) => {
    const query = "SELECT * FROM Reservation";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching reservations:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        res.status(200).json(results);
    });
});

// Route to get a specific reservation by Reservation_no
router.get("/:reservation_no", (req, res) => {
    const { reservation_no } = req.params; // Extract reservation_no from URL parameters
    const query = "SELECT * FROM Reservation WHERE Reservation_no = ?";

    db.query(query, [reservation_no], (err, results) => {
        if (err) {
            console.error("Error fetching reservation:", err);
            return res.status(500).json({ error: "Failed to fetch reservation" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.json(results[0]); // Only return the first result since we expect one reservation
    });
});

// Route to delete a reservation by Reservation_no
router.delete("/:reservation_no", (req, res) => {
    const { reservation_no } = req.params; // Extract reservation_no from URL parameters

    const query = "DELETE FROM Reservation WHERE Reservation_no = ?";

    db.query(query, [reservation_no], (err, result) => {
        if (err) {
            console.error("Error deleting reservation:", err);
            return res.status(500).json({ error: "Failed to delete reservation" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation deleted successfully" });
    });
});

export default router;
