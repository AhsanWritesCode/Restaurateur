// index.js
import express from "express";
import cors from "cors";
import restaurantTableRoutes from "./routes/restaurantTable.js";
import loginRoutes from "./routes/login.js";
import shiftRoutes from "./routes/shift.js";
import employeeRoutes from "./routes/employee.js";
import inventoryRoutes from "./routes/inventory.js"
import restockRoutes from './routes/restock.js';
import customerRoutes from './routes/customer.js'
import reservationRoutes from "./routes/reservations.js"

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/RestaurantTable", restaurantTableRoutes);
app.use("/employee/login", loginRoutes);
app.use("/shifts", shiftRoutes);
app.use("/employees", employeeRoutes);
app.use("/inventory", inventoryRoutes);
app.use('/restock-ledger', restockRoutes);
app.use('/customer',customerRoutes);
app.use('/reservations', reservationRoutes);

// Root test route
app.get("/", (req, res) => {
    res.json("Hello, this is the backendAPI!");
});

app.listen(8800, () => {
    console.log("Connected to backend!");
});
