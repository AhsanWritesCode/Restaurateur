import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BartenderWindow.css';

const BartenderWindowCompleted = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8800/Contains_drinks/BartenderWindowCompleted');
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch bartender completed orders", err);
            }
        };

        fetchCompletedOrders();
    }, []);

    // Group drinks by order number, while also storing the table, order time, and status
    const groupedOrders = orders.reduce((acc, drink) => {
        const { Order_number, Table_number, Time_placed, Bartender_order_status, Cook_order_status } = drink;

        if (!acc[Order_number]) {
            acc[Order_number] = {
                drinks: [],
                Table_number,
                Time_placed,
                Bartender_order_status,
                Cook_order_status
            };
        }
        acc[Order_number].drinks.push(drink);
        return acc;
    }, {});

    // Filter orders to only show completed ones
    const completedOrders = Object.entries(groupedOrders).filter(([_, order]) => 
        order.Bartender_order_status === 'completed'
    );

    // Map completed orders to order boxes
    const orderBoxes = completedOrders.slice(0, 12).map(([orderNumber, order], i) => (
        <div className="order-box" key={i}>
            <div className="box-content">
                <p><strong>Order #{orderNumber}</strong></p>
                <p><strong>Table:</strong> {order.Table_number}</p>
                <p><strong>Order Time:</strong> {new Date(order.Time_placed).toLocaleTimeString()}</p>
                <p><strong>Cook Status:</strong> {order.Cook_order_status}</p> {/* Show Cook order status */}
                <p><strong>Bartender Status:</strong> {order.Bartender_order_status}</p> {/* Show Bartender order status */}
                <ul>
                    {order.drinks.map((drink, idx) => (
                        <li key={idx}>
                            {drink.Drink_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    ));

    // Fill up remaining empty boxes to make 12
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

export default BartenderWindowCompleted;
