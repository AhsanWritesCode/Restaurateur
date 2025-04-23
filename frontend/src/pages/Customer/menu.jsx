// Menu.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = () => {
    const [drinks, setDrinks] = useState([]);
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/Drinks");
                setDrinks(res.data);
            } catch (err) {
                console.error("Failed to fetch drinks:", err);
            }
        };

        const fetchDishes = async () => {
            try {
                const res = await axios.get("http://localhost:8800/Dishes");
                setDishes(res.data);
            } catch (err) {
                console.error("Failed to fetch dishes:", err);
            }
        };

        fetchDrinks();
        fetchDishes();
    }, []);

    return (
        <div className="menu-container">
            <h2>Our Menu</h2>
            <div className="menu-section">
                <h3>Drinks</h3>
                <ul className="menu-list">
                    {drinks.map((drink) => (
                        <li key={drink.Drink_ID} className="menu-item">
                            <span>{drink.Item_name}</span> - <span>${drink.Price}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="menu-section">
                <h3>Dishes</h3>
                <ul className="menu-list">
                    {dishes.map((dish) => (
                        <li key={dish.Dish_ID} className="menu-item">
                            <span>{dish.Item_name}</span> - <span>${dish.Price}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Menu;
