import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all ingredients
router.get("/", (req, res) => {
    const query = "SELECT * FROM Ingredients";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Failed to fetch ingredients:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// PUT update quantity for a specific ingredient
router.put("/:id", (req, res) => {
    const ingredientId = req.params.id;
    const newQuantity = req.body.quantity;

    const q = "UPDATE Ingredients SET Quantity = ? WHERE Ingredient_ID = ?";

    db.query(q, [newQuantity, ingredientId], (err, result) => {
        if (err) {
            console.error("Failed to update quantity:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({ message: "Quantity updated successfully" });
    });
});


export default router;
