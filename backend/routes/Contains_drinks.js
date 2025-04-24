import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all drinks from Contains_drinks
router.get("/", (req, res) => {
  const q = "SELECT * FROM Contains_drinks";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching Contains_drinks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(data);
  });
});

// POST a new drink into Contains_drinks
router.post("/", (req, res) => {
  const { Order_number, Drink_number, Drink_name, Quantity, Price, Table_number } = req.body;

  const q = `
    INSERT INTO Contains_drinks (Order_number, Drink_number, Drink_name, Quantity, Price, Table_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(q, [Order_number, Drink_number, Drink_name, Quantity, Price, Table_number], (err, result) => {
    if (err) {
      console.error("Error inserting into Contains_drinks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(201).json({ message: "Drink added to order" });
  });
});

// GET drinks for a specific table
router.get("/byTable/:tableNumber", (req, res) => {
  const { tableNumber } = req.params;

  const q = "SELECT * FROM Contains_drinks WHERE Table_number = ?";
  db.query(q, [tableNumber], (err, data) => {
    if (err) {
      console.error("Error fetching drinks by table number:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json(data);
  });
});

// GET orders for the bartender window (in progress orders)
router.get("/BartenderWindow", (req, res) => {
  const query = `
    SELECT 
        o.Order_number,
        o.Table_number,
        o.Time_placed,
        o.Bartender_order_status,
        o.Cook_order_status,
        d.Drink_number,
        d.Drink_name,
        d.Price
    FROM 
        RestaurantOrder o
    JOIN 
        Contains_drinks d ON o.Order_number = d.Order_number
    WHERE 
        o.Bartender_order_status = 'in progress'
    ORDER BY 
        o.Order_number;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders', error: err });
    }
    res.json(results);
  });
});

// GET completed orders for the bartender window
router.get("/BartenderWindowCompleted", (req, res) => {
  const query = `
    SELECT 
        o.Order_number,
        o.Table_number,
        o.Time_placed,
        o.Bartender_order_status,
        o.Cook_order_status,
        d.Drink_number,
        d.Drink_name,
        d.Price
    FROM 
        RestaurantOrder o
    JOIN 
        Contains_drinks d ON o.Order_number = d.Order_number
    WHERE 
        Bartender_order_status = 'completed'
    ORDER BY 
        o.Order_number;
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching completed orders', error: err });
    }
    res.json(results);
  });
});

// PUT to mark an order as completed
router.put("/complete/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const q = `UPDATE RestaurantOrder SET  Bartender_order_status = 'completed'  WHERE Order_number = ?`;

  db.query(q, [orderNumber], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to complete order', error: err });
      return res.status(200).json({ message: 'Order marked as completed' });
  });
});

export default router;
