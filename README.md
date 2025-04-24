# Restauranteur

A platform that allows employees to sign in, log their hours, and view orders placed by customers while also allowing customers to view both menu items offered by restaurants and parking availability. 

## Tech Stack

Frontend: React
Backend: Node.js, Express.js, MySQL
Database: Amazon AWS RDS (MySQL)

## Running the web application Front End

Clone the repository:

   git clone https://github.com/AhsanWritesCode/cpsc471-project
   
   cd frontend

Install dependencies:

   npm install
   npm install axios react-router-dom

Run the web application:

   npm start

Go to localhost:3000 to view the application


## Backend Setup

   Install Dependancies:

   cd backend
   npm install express mysql cors

   To launch api (needs to be running simultaneously with frontend):
   
   node index.js

Go to (http://localhost:8800/RestaurantTable) to view sample. If you can see the Table values then the API is running successfully!

## API Endpoints

The backend server provides RESTful endpoints for the following:

http://localhost:8800  
http://localhost:8800/RestaurantTable  
http://localhost:8800/Contains_dishes  
http://localhost:8800/Contains_drinks  
http://localhost:8800/customer  
http://localhost:8800/dishes  
http://localhost:8800/drinks  
http://localhost:8800/employees  <-- CONTAINS ALL LOGINS
http://localhost:8800/inventory  
http://localhost:8800/ParkingSpace  
http://localhost:8800/reservations  
http://localhost:8800/Restaurantorder  
http://localhost:8800/restock-ledger  
http://localhost:8800/shifts  

The backend connects to a MySQL database hosted on Amazon AWS: restauranteur.cra828c66kkd.us-east-2.rds.amazonaws.com

## Notes

- Ensure both frontend and backend servers are running simultaneously for full functionality.
- Frontend runs on port 3000; Backend runs on port 8800.
- The root login for the employee portal page is:
      User: 1
      Password: cusadmin

## Authors

Developed by AhsanWritesCode  
GitHub: https://github.com/AhsanWritesCode