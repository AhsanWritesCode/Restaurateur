import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Login endpoint
router.post("/", (req, res) => {
    const { employeeId, password } = req.body;
    const q = "SELECT * FROM Employee WHERE Employee_ID = ? AND Password = ?";

    db.query(q, [employeeId, password], (err, data) => {
        console.log("Login request body:", req.body);
        if (err) return res.status(500).json({ success: false, error: err });
        if (data.length > 0) {
            return res.json({ success: true, employee: data[0] });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});



export default router;