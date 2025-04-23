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

router.delete("/:tableNumber", (req, res) => {
    const tableNumber = req.params.tableNumber;

    const deleteContainsDishes = "DELETE FROM Contains_dishes WHERE Table_number = ?";
    const deleteContainsDrinks = "DELETE FROM Contains_drinks WHERE Table_number = ?";
    const deleteReservations = "DELETE FROM Reservation WHERE Table_number = ?";
    const deleteOrders = "DELETE FROM RestaurantOrder WHERE Table_number = ?";
    const deleteTable = "DELETE FROM RestaurantTable WHERE Table_number = ?";

    console.log(`Starting deletion for table number: ${tableNumber}`);

    db.query(deleteContainsDishes, [tableNumber], (err, result) => {
        if (err) {
            console.error("Failed to delete from Contains_dishes:", err);
            return res.status(500).json(err);
        }
        console.log("Deleted from Contains_dishes:", result.affectedRows);

        db.query(deleteContainsDrinks, [tableNumber], (err, result) => {
            if (err) {
                console.error("Failed to delete from Contains_drinks:", err);
                return res.status(500).json(err);
            }
            console.log("Deleted from Contains_drinks:", result.affectedRows);

            db.query(deleteReservations, [tableNumber], (err, result) => {
                if (err) {
                    console.error("Failed to delete from Reservations:", err);
                    return res.status(500).json(err);
                }
                console.log("Deleted from Reservations:", result.affectedRows);

                db.query(deleteOrders, [tableNumber], (err, result) => {
                    if (err) {
                        console.error("Failed to delete from RestaurantOrder:", err);
                        return res.status(500).json(err);
                    }
                    console.log("Deleted from RestaurantOrder:", result.affectedRows);

                    db.query(deleteTable, [tableNumber], (err, result) => {
                        if (err) {
                            console.error("Failed to delete from RestaurantTable:", err);
                            return res.status(500).json(err);
                        }
                        console.log("Deleted from RestaurantTable:", result.affectedRows);
                        return res.json("Table and all related records deleted successfully!");
                    });
                });
            });
        });
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
