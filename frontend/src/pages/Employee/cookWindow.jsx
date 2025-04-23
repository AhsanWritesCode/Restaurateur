import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CookWindow.css';
import CookWindowCompleted from './cookWindowCompleted';

const CookWindow = () => {
    const [orders, setOrders] = useState([]);
    const [viewPastOrders, setViewPastOrders] = useState(false);

    useEffect(() => {
        const fetchDishOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8800/Contains_dishes/CookWindow');
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch cook orders", err);
            }
        };

        fetchDishOrders();
    }, []);

    const markOrderAsCompleted = async (orderNumber) => {
        try {
            await axios.put(`http://localhost:8800/Contains_dishes/complete/${orderNumber}`);
            setOrders(prev => prev.filter(order => order.Order_number !== parseInt(orderNumber)));
        } catch (err) {
            console.error("Failed to update dish order status", err);
        }
    };

    const groupedOrders = orders.reduce((acc, dish) => {
        const { Order_number, Table_number, Time_placed, Cook_order_status } = dish;

        if (!acc[Order_number]) {
            acc[Order_number] = {
                dishes: [],
                Table_number,
                Time_placed,
                Cook_order_status
            };
        }
        acc[Order_number].dishes.push(dish);
        return acc;
    }, {});

    const orderBoxes = Object.entries(groupedOrders).slice(0, 12).map(([orderNumber, order], i) => (
        <div className="order-box" key={i}>
            <div className="box-content">
                <p><strong>Order #{orderNumber}</strong></p>
                <p><strong>Table:</strong> {order.Table_number}</p>
                <p><strong>Order Time:</strong> {new Date(order.Time_placed).toLocaleTimeString()}</p>
                <p><strong>Status:</strong> {order.Cook_order_status}</p> 
                <ul>
                    {order.dishes.map((dish, idx) => (
                        <li key={idx}>
                            {dish.Dish_name}
                        </li>
                    ))}
                </ul>
                <button className="complete-button" onClick={() => markOrderAsCompleted(orderNumber)}>
                    Completed
                </button>
            </div>
        </div>
    ));

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

    const toggleView = () => {
        setViewPastOrders(prev => !prev);
    };

    return (
        <div className="cook-window">
            <h2 className="title">Cook Order Window</h2>
            <button onClick={toggleView} className="view-past-orders-button">
                {viewPastOrders ? "View Current Orders" : "View Past Orders"}
            </button>

            {viewPastOrders ? (
                <CookWindowCompleted />
            ) : (
                <div className="grid-container">
                    {orderBoxes}
                </div>
            )}
        </div>
    );
};

export default CookWindow;
