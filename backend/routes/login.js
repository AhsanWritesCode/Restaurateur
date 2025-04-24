import express from "express";
import { db } from "../db.js";

const router = express.Router();

// POST endpoint for employee login
router.post("/", (req, res) => {
    const { employeeId, password } = req.body;
    const q = "SELECT * FROM Employee WHERE Employee_ID = ? AND Password = ?";

    db.query(q, [employeeId, password], (err, data) => {
        console.log("Login request body:", req.body);
        if (err) return res.status(500).json({ success: false, error: err });

        // If there is a matching employee that has a matching ID and password then success
        if (data.length > 0) {
            return res.json({ success: true, employee: data[0] });

        // if no matching empoyee is found then the credentials are invalid
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});



export default router;