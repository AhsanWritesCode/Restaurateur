import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET function to get all dishes from Contains_dishes allows for
router.get("/", (req, res) => {
  const q = "SELECT * FROM Contains_dishes";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching Contains_dishes:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(data);
  });
});

// POST a new dish into Contains_dishes
router.post("/", (req, res) => {
  const { Order_number, Dish_number, Dish_name, Quantity, Price, Table_number } = req.body;

  const q = `
    INSERT INTO Contains_dishes (Order_number, Dish_number, Dish_name, Quantity, Price, Table_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(q, [Order_number, Dish_number, Dish_name, Quantity, Price, Table_number], (err, result) => {
    if (err) {
      console.error("Error inserting into Contains_dishes:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(201).json({ message: "Dish added to order" });
  });
});

// GET dishes for a specific table
router.get("/byTable/:tableNumber", (req, res) => {
  const { tableNumber } = req.params;


  const q = "SELECT * FROM Contains_dishes WHERE Table_number = ?";
  db.query(q, [tableNumber], (err, data) => {
    if (err) {
      console.error("Error fetching dishes by table number:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json(data);
  });
});


// GET current 'in progress' dish orders for CookWindow
router.get("/CookWindow", (req, res) => {
  const query = `
    SELECT 
        o.Order_number,
        o.Table_number,
        o.Time_placed,
        o.Bartender_order_status,
        o.Cook_order_status,
        d.Dish_number,
        d.Dish_name,
        d.Price
    FROM 
        RestaurantOrder o
    JOIN 
        Contains_dishes d ON o.Order_number = d.Order_number
    WHERE 
        o.Cook_order_status = 'pending'
    ORDER BY 
        o.Order_number;
  `;

  db.query(query, (err, results) => {
    if (err) {
        return res.status(500).json({ message: 'Error fetching cook orders', error: err });
    }
    res.json(results);
  });
});

// GET 'completed' dish orders for CookWindowCompleted
router.get("/CookWindowCompleted", (req, res) => {
  const query = `
    SELECT 
        o.Order_number,
        o.Table_number,
        o.Time_placed,
        o.Bartender_order_status,
        o.Cook_order_status,
        d.Dish_number,
        d.Dish_name,
        d.Price
    FROM 
        RestaurantOrder o
    JOIN 
        Contains_dishes d ON o.Order_number = d.Order_number
    WHERE 
        o.Cook_order_status = 'completed'
    ORDER BY 
        o.Order_number;
  `;

  db.query(query, (err, results) => {
    if (err) {
        return res.status(500).json({ message: 'Error fetching completed cook orders', error: err });
    }
    res.json(results);
  });
});

// Marks order as complete, if order is complete it cannot be uncompleted
router.put("/complete/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const q = `UPDATE RestaurantOrder
             SET Cook_order_status = 'completed' 
             WHERE Order_number = ?`;

  db.query(q, [orderNumber], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to complete order', error: err });
      return res.status(200).json({ message: 'Order marked as completed' });
  });
});

export default router;
