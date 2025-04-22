// db.js
import mysql from "mysql";

export const db = mysql.createConnection({
    host: "restauranteur.cra828c66kkd.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Group23r_",
    database: "RestauranteurDB"
});
