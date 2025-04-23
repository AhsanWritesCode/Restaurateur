import express from "express";
import { db } from "../db.js";

const router = express.Router();

// POST to create an order
router.post('/', (req, res) => {
    const { tableNumber, serverID, selectedDishes, selectedDrinks } = req.body;

    // Calculate the total bill (sum of prices)
    const dishTotal = selectedDishes.reduce((total, dish) => total + dish.Price, 0);
    const drinkTotal = selectedDrinks.reduce((total, drink) => total + drink.Price, 0);
    const totalBill = dishTotal + drinkTotal;

    // Insert into RestaurantOrder with Cook_order_status and Bartender_order_status
    const q = `
        INSERT INTO RestaurantOrder (Table_number, Server_ID, Bartender_order_status, Cook_order_status, Bill, Time_placed) 
        VALUES (?, ?, 'in progress', 'pending', ?, NOW())
    `;
    const values = [tableNumber, serverID, totalBill];
    
    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Error creating order' });
        }

        const orderNumber = result.insertId;

        // Insert into Contains_dishes
        const dishPromises = selectedDishes.map(dish => {
            const dishQuery = "INSERT INTO Contains_dishes (Order_number, Dish_name, Dish_number, Price, Table_number) VALUES (?, ?, ?, ?, ?)";
            const dishValues = [orderNumber, dish.Item_name, dish.Menu_number, dish.Price, tableNumber];
            return new Promise((resolve, reject) => {
                db.query(dishQuery, dishValues, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        });

        // Insert into Contains_drinks
        const drinkPromises = selectedDrinks.map(drink => {
            const drinkQuery = "INSERT INTO Contains_drinks (Order_number, Drink_name, Drink_number, Price, Table_number) VALUES (?, ?, ?, ?, ?)";
            const drinkValues = [orderNumber, drink.Item_name, drink.Menu_number, drink.Price, tableNumber];
            return new Promise((resolve, reject) => {
                db.query(drinkQuery, drinkValues, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        });

        // Wait for all the insertions to complete
        Promise.all([...dishPromises, ...drinkPromises])
            .then(() => {
                return res.status(201).json({ Order_number: orderNumber });
            })
            .catch(err => {
                console.error('Error inserting dishes and drinks:', err);
                res.status(500).json({ error: 'Error inserting dishes and drinks' });
            });
    });
});

// GET all items for a specific order and calculate total price
router.get("/orderItems/:orderNumber", (req, res) => {
    const { orderNumber } = req.params;

    const qDishes = `SELECT Dish_name, Price FROM Contains_dishes WHERE Order_number = ?`;
    const qDrinks = `SELECT Drink_name, Price FROM Contains_drinks WHERE Order_number = ?`;

    db.query(qDishes, [orderNumber], (err, dishesData) => {
        if (err) return res.status(500).json({ error: "Error fetching dishes" });

        db.query(qDrinks, [orderNumber], (err, drinksData) => {
            if (err) return res.status(500).json({ error: "Error fetching drinks" });

            const allItems = [...dishesData, ...drinksData];
            const totalPrice = allItems.reduce((sum, item) => sum + parseFloat(item.Price), 0);

            return res.status(200).json({ items: allItems, totalPrice });
        });
    });
});

// DELETE to remove an order by Table_number
router.delete('/:tableNumber', (req, res) => {
    const { tableNumber } = req.params;

    // First, delete all dishes related to the table
    const deleteDishesQuery = "DELETE FROM Contains_dishes WHERE Table_number = ?";
    db.query(deleteDishesQuery, [tableNumber], (err, result) => {
        if (err) {
            console.error('Error deleting dishes:', err);
            return res.status(500).json({ error: 'Error deleting dishes' });
        }

        // Then, delete all drinks related to the table
        const deleteDrinksQuery = "DELETE FROM Contains_drinks WHERE Table_number = ?";
        db.query(deleteDrinksQuery, [tableNumber], (err, result) => {
            if (err) {
                console.error('Error deleting drinks:', err);
                return res.status(500).json({ error: 'Error deleting drinks' });
            }

            // Finally, delete the order itself
            const deleteOrderQuery = "DELETE FROM RestaurantOrder WHERE Table_number = ?";
            db.query(deleteOrderQuery, [tableNumber], (err, result) => {
                if (err) {
                    console.error('Error deleting order:', err);
                    return res.status(500).json({ error: 'Error deleting order' });
                }

                // Send response indicating the order has been deleted
                return res.status(200).json({ message: `Order for table ${tableNumber} deleted successfully` });
            });
        });
    });
});

// Other routes remain unchanged...

export default router;
