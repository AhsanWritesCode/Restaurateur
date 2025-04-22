import express from "express";
import { db } from "../db.js";

const router = express.Router();

// all employees
router.get('/', async (req, res) => {
    const q = "SELECT * FROM Employee";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});


// Add new employee
router.post('/', async (req, res) => {
    const { Employee_ID, Name, Email,Phone_number, Password, Role } = req.body;

    const q = "INSERT INTO Employee (Employee_ID, Name, Email ,Phone_number, Password, Role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(q, [Employee_ID, Name, Email,Phone_number, Password, Role], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Employee added!");
    });
});

// Delete employee
router.delete('/:id', (req, res) => {
    const q = "DELETE FROM Employee WHERE Employee_ID = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Employee deleted.");
    });
});



// Get one employee by ID
router.get('/:id', (req, res) => {
    const q = "SELECT * FROM Employee WHERE Employee_ID = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "Employee not found" });
        res.json(data[0]);
    });
});



router.put('/:id', (req, res) => {
    const Employee_ID = req.params.id;
    const { name, phoneNumber, email, position, password } = req.body;

    // Start building the SET clause
    let setFields = ["Name = ?", "Phone_number = ?", "Email = ?", "Role = ?"];
    let queryParams = [name, phoneNumber, email, position];

    // Only add password if provided
    if (password && password.trim() !== '') {
        setFields.push("Password = ?");
        queryParams.push(password);
    }

    // Finalize query
    const query = `
        UPDATE Employee
        SET ${setFields.join(', ')}
        WHERE Employee_ID = ?
    `;
    queryParams.push(Employee_ID);

    console.log('Executing SQL Query:', query); 
    console.log('With Params:', queryParams); 

    db.query(query, queryParams, (err, data) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json(err);
        }
        res.json("Employee updated.");
    });
});



export default router;