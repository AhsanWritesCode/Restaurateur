import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all restaurant tables
router.get("/", (req, res) => {
    const q = "SELECT * FROM RestaurantTable";
    db.query(q, (err, data) => {
        if (err) return res.json(err);  // Return error if query fails
        return res.json(data);          // Return all table records
    });
});

// POST a new table to the database
router.post("/", (req, res) => {
    const { tableNumber, vacancy } = req.body;
    const q = "INSERT INTO RestaurantTable (Table_number, Vacancy) VALUES (?, ?)";
    db.query(q, [tableNumber, vacancy], (err, data) => {
        if (err) return res.json(err);  // Return error if insert fails
        return res.json("Table has been created successfully!");
    });
});

// DELETE a table by its number
router.delete("/:tableNumber", (req, res) => {
    const tableNumber = req.params.tableNumber;
    const q = "DELETE FROM RestaurantTable WHERE Table_number = ?";
    db.query(q, [tableNumber], (err, data) => {
        if (err) return res.json(err);   // Return error if delete fails
        return res.json("Table has been deleted successfully!");
    });
});

// PUT to update a table's vacancy status
router.put("/:tableNumber", (req, res) => {
    const tableNumber = req.params.tableNumber;
    const { vacancy } = req.body;   // Return error if update fails
    const q = "UPDATE RestaurantTable SET Vacancy = ? WHERE Table_number = ?";
    db.query(q, [vacancy, tableNumber], (err, data) => {
        if (err) return res.json(err);
        return res.json("Vacancy has been updated successfully!");
    });
});

export default router;
