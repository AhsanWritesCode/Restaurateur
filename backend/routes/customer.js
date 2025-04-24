import express from "express";
import { db } from "../db.js";

const router = express.Router();


// Route to get all customers
router.get("/", (req, res) => {
    const query = "SELECT * FROM Customer";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Failed to fetch Customers:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// Check if customer exists or insert new one
router.post("/", (req, res) => {
    const { name, phone } = req.body;

    const checkQuery = "SELECT Customer_ID FROM Customer WHERE Name = ? AND Phone_number = ?";
    db.query(checkQuery, [name, phone], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            // Customer exists
            return res.json({ Customer_ID: results[0].Customer_ID });
        } else {
            // Insert new customer
            const insertQuery = "INSERT INTO Customer (Name, Phone_number) VALUES (?, ?)";
            db.query(insertQuery, [name, phone], (err, result) => {
                if (err) return res.status(500).json(err);
                return res.json({ Customer_ID: result.insertId });
            });
        }
    });
});

// Delete customers without any reservations using NOT EXISTS
router.delete("/", (req, res) => {
    const deleteQuery = `
        DELETE FROM Customer
        WHERE NOT EXISTS (
            SELECT 1 FROM Reservation WHERE Reservation.Customer_ID = Customer.Customer_ID
        )
    `;

    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error("Failed to delete customers without reservations:", err);
            return res.status(500).json({ error: "Failed to delete customer data" });
        }
        res.json({ message: "Customers without reservations have been deleted successfully!" });
    });
});



export default router;
