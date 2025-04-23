import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BartenderWindow.css';
import BartenderWindowCompleted from './bartenderWindowCompleted';

const BartenderWindow = () => {
    const [orders, setOrders] = useState([]);
    const [viewPastOrders, setViewPastOrders] = useState(false); // Toggle state for current vs completed orders

    useEffect(() => {
        const fetchDrinkOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8800/Contains_drinks/BartenderWindow');
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch bartender orders", err);
            }
        };

        fetchDrinkOrders();
    }, []);

    // Mark order as completed
    const markOrderAsCompleted = async (orderNumber) => {
        try {
            await axios.put(`http://localhost:8800/Contains_drinks/complete/${orderNumber}`);
            setOrders(prev => prev.filter(order => order.Order_number !== parseInt(orderNumber)));
        } catch (err) {
            console.error("Failed to update order status", err);
        }
    };

    // Group drinks by order number
    const groupedOrders = orders.reduce((acc, drink) => {
        const { Order_number, Table_number, Time_placed, Bartender_order_status } = drink;

        if (!acc[Order_number]) {
            acc[Order_number] = {
                drinks: [],
                Table_number,
                Time_placed,
                Bartender_order_status
            };
        }
        acc[Order_number].drinks.push(drink);
        return acc;
    }, {});

    // Map orders to order boxes
    const orderBoxes = Object.entries(groupedOrders).slice(0, 12).map(([orderNumber, order], i) => (
        <div className="order-box" key={i}>
            <div className="box-content">
                <p><strong>Order #{orderNumber}</strong></p>
                <p><strong>Table:</strong> {order.Table_number}</p>
                <p><strong>Order Time:</strong> {new Date(order.Time_placed).toLocaleTimeString()}</p>
                <p><strong>Status:</strong> {order.Bartender_order_status}</p> {/* Show Bartender order status */}
                <ul>
                    {order.drinks.map((drink, idx) => (
                        <li key={idx}>
                            {drink.Drink_name}
                        </li>
                    ))}
                </ul>
                {order.Bartender_order_status !== 'completed' && (
                    <button className="complete-button" onClick={() => markOrderAsCompleted(orderNumber)}>
                        Completed
                    </button>
                )}
            </div>
        </div>
    ));

    // Fill up remaining empty boxes to make 12
    while (orderBoxes.length < 12) {
        orderBoxes.push(
            <div className="order-box" key={orderBoxes.length}>
                <div className="box-content">
                    <p>Empty</p>
                    <button className="complete-button" disabled>Completed</button>
                </div>
            </div>
        );
    }

    // Toggle between viewing past orders and current orders
    const toggleView = () => {
        setViewPastOrders(prev => !prev);
    };

    return (
        <div className="bartender-window">
            <h2 className="title">Bartender Order Window</h2>
            {/* Button to toggle between past and current orders */}
            <button onClick={toggleView} className="view-past-orders-button">
                {viewPastOrders ? "View Current Orders" : "View Past Orders"}
            </button>

            {/* Only render current orders or completed orders */}
            {viewPastOrders ? (
                <BartenderWindowCompleted />
            ) : (
                <div className="grid-container">
                    {orderBoxes} {/* Show current orders */}
                </div>
            )}
        </div>
    );
};

export default BartenderWindow;
