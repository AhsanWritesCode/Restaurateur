
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all drinks
router.get("/", (req, res) => {
    const q = "SELECT * FROM Drinks";
    db.query(q, (err, data) => {
        if (err) return res.json(err);  // Return error if query fails
        return res.json(data);          // Return all table records
    });
});


export default router;
