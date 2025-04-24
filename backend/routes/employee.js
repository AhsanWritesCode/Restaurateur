import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
    const q = "SELECT * FROM Employee";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});


// POST new employee by adding employee to database
router.post('/', async (req, res) => {
    const { Employee_ID, Name, Email,Phone_number, Password, Role } = req.body;

    const q = "INSERT INTO Employee (Employee_ID, Name, Email ,Phone_number, Password, Role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(q, [Employee_ID, Name, Email,Phone_number, Password, Role], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Employee added!");
    });
});

// DELETE employee and all related records manually
router.delete('/:id', (req, res) => {
    const eid = req.params.id;

    const deleteQueries = [
        // Delete bartender certificates
        { query: "DELETE FROM Bartender_certificates WHERE EID = ?", params: [eid] },
        // Delete shifts
        { query: "DELETE FROM Shifts WHERE EID = ?", params: [eid] },
        // Delete orders where the employee was the server
        { query: "DELETE FROM RestaurantOrder WHERE Server_ID = ?", params: [eid] },
        // Finally, delete the employee record
        { query: "DELETE FROM Employee WHERE Employee_ID = ?", params: [eid] }
    ];

    const executeQueries = (index = 0) => {
        if (index >= deleteQueries.length) {
            return res.json({ message: "Employee and all related records deleted successfully." });
        }

        const { query, params } = deleteQueries[index];
        db.query(query, params, (err) => {
            if (err) {
                return res.status(500).json({ 
                    error: `Error executing query at step ${index + 1}`,
                    query,
                    details: err 
                });
            }
            executeQueries(index + 1);
        });
    };

    executeQueries();
});



// GET one employee by given employeeID
router.get('/:id', (req, res) => {
    const q = "SELECT * FROM Employee WHERE Employee_ID = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "Employee not found" });
        res.json(data[0]);
    });
});


// PUT update employee info given employeeID
router.put('/:id', (req, res) => {

    const Employee_ID = req.params.id;
    const { name, phoneNumber, email, position, password } = req.body;

    // Start building the SET clause
    let setFields = ["Name = ?", "Phone_number = ?", "Email = ?", "Role = ?"];
    let queryParams = [name, phoneNumber, email, position];

    // Only add password if provided, if password is provided then add Password to the query
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