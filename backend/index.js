import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())



// this section is for the api

const db = mysql.createConnection({
    host:"restauranteur.cra828c66kkd.us-east-2.rds.amazonaws.com",
    user:"admin",
    password:"Group23r_",
    database:"RestauranteurDB"
})

// mainpage
app.get("/",(req,res)=>{
    res.json("Hello, this is the backendAPI!")
})


// get request to grab values from a table i break it down to see 
// how majorty of the requests works we just need a shit ton of these for each table

// chooses ResturantTable table (lol) from db
app.get("/RestaurantTable", (req,res)=>{
    //call an sql query
    const q = "SELECT * FROM RestaurantTable"
    // this is just an error check if query fails
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        //return error reason
        return res.json(data)
    })
})

// post request to create new values for a table THIS JUST AN EXAMPLE DO NOT I REPEAT DO NOT use this post request
app.post("/RestaurantTable", (req,res)=>{
    const q = "INSERT INTO RestaurantTable (Table_number,Vacancy) VALUES (?)"
    //temp balues
    const values = [3,0]

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("Table has been added created succcessfully!")
    })
    
})

//TODO delete + edit api functions

// ensure connection is established on its own port
app.listen(8800, ()=>{
    console.log("Connected to backend!")
})