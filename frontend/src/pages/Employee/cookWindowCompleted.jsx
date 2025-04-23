import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CookWindow.css';

const CookWindowCompleted = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8800/Contains_dishes/CookWindowCompleted');
                const completed = res.data.filter(order => order.Cook_order_status === 'completed');
                setOrders(completed);
            } catch (err) {
                console.error("Failed to fetch completed cook orders", err);
            }
        };

        fetchCompletedOrders();
    }, []);

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
                <button className="complete-button" disabled>
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
                </div>
            </div>
        );
    }

    return (
        <div className="grid-container">
            {orderBoxes}
        </div>
    );
};

export default CookWindowCompleted;
