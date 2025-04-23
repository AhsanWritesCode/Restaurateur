import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServerOrderMenu.css';

const ServerOrderMenu = () => {
  const [tables, setTables] = useState([]); // List of tables
  const [selectedTable, setSelectedTable] = useState(null); // Selected table
  const [dishes, setDishes] = useState([]); // List of dishes
  const [drinks, setDrinks] = useState([]); // List of drinks
  const [selectedItems, setSelectedItems] = useState({ dishes: [], drinks: [] }); // Selected items for the order
  const [serverID, setServerID] = useState(1); // Hardcoded server ID (replace with actual user ID)
  const [bill, setBill] = useState({ dishes: [], drinks: [] }); // Bill data (ordered dishes and drinks)

  useEffect(() => {
    // Fetch list of tables when the component mounts
    console.log("Fetching list of tables..."); // Debug
    axios.get('http://localhost:8800/RestaurantTable')
      .then(res => {
        setTables(res.data);
        console.log("Tables fetched:", res.data); // Debug
      })
      .catch(err => console.error('Error fetching tables:', err));
  }, []);

  useEffect(() => {
    if (selectedTable) {
      console.log("Selected table:", selectedTable); // Debug
      // Fetch dishes and drinks for the selected table using two parallel requests
      axios.all([ 
        axios.get(`http://localhost:8800/Contains_dishes/byTable/${selectedTable}`), 
        axios.get(`http://localhost:8800/Contains_drinks/byTable/${selectedTable}`) 
      ])
      .then(axios.spread((dishesRes, drinksRes) => {
        console.log("Dishes:", dishesRes.data); // Log the dishes data
        console.log("Drinks:", drinksRes.data); // Log the drinks data
        setBill({
          dishes: dishesRes.data,
          drinks: drinksRes.data
        });
      }))
      .catch(err => console.error('Error fetching bill:', err));
    }
  }, [selectedTable]);

  const handleTableSelect = (tableNumber) => {
    console.log("Table selected:", tableNumber); // Debug
    setSelectedTable(tableNumber); // Set the selected table
    fetchMenuItems();
  };

  const fetchMenuItems = () => {
    console.log("Fetching menu items..."); // Debug
    axios.get('http://localhost:8800/Dishes')
      .then(res => {
        setDishes(res.data);
        console.log("Dishes fetched:", res.data); // Debug
      })
      .catch(err => console.error('Error fetching dishes:', err));

    axios.get('http://localhost:8800/Drinks')
      .then(res => {
        setDrinks(res.data);
        console.log("Drinks fetched:", res.data); // Debug
      })
      .catch(err => console.error('Error fetching drinks:', err));
  };

  const handleAddItem = (item, type) => {
    console.log(`Adding ${item.Item_name} to ${type}`); // Debug
    setSelectedItems(prev => ({
      ...prev,
      [type]: [...prev[type], item],
    }));
  };

  const handleRemoveItem = (item, type) => {
    console.log(`Removing ${item.Item_name} from ${type}`); // Debug
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i.Menu_number !== item.Menu_number),
    }));
  };

  const handleSubmitOrder = () => {
    const { dishes, drinks } = selectedItems;
    if (dishes.length === 0 && drinks.length === 0) {
      alert("Please select at least one dish or drink");
      return;
    }

    const orderData = {
      tableNumber: selectedTable,
      serverID,
      selectedDishes: dishes,
      selectedDrinks: drinks,
      bartenderOrderStatus: 'in progress',
      cookOrderStatus: 'pending'
    };

    console.log("Submitting order:", orderData); // Debug
    axios.post('http://localhost:8800/RestaurantOrder', orderData)
      .then(response => {
        alert(`Order ${response.data.Order_number} placed successfully!`);
        setSelectedItems({ dishes: [], drinks: [] });

        // After placing the order, update the bill
        setBill(prevBill => ({
          dishes: [...prevBill.dishes, ...dishes],
          drinks: [...prevBill.drinks, ...drinks]
        }));
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert("Failed to place the order.");
      });
  };

  const calculateTotal = () => {
    const allItems = [...bill.dishes, ...bill.drinks];
    const groupedItems = allItems.reduce((acc, item) => {
      const itemName = item.Dish_name || item.Drink_name;
      if (acc[itemName]) {
        acc[itemName].quantity += item.Quantity || 1;
        acc[itemName].price += item.Price * (item.Quantity || 1);
      } else {
        acc[itemName] = {
          name: itemName,
          price: item.Price * (item.Quantity || 1),
          quantity: item.Quantity || 1,
        };
      }
      return acc;
    }, {});

    let total = 0;
    for (const key in groupedItems) {
      total += groupedItems[key].price;
    }

    console.log("Calculated total:", total.toFixed(2)); // Debug
    return total.toFixed(2);
  };


  // Handle deleting an order for the selected table
  const handleDeleteOrder = () => {
    if (selectedTable) {
      console.log(`Deleting order for table ${selectedTable}...`); // Debug
      axios.delete(`http://localhost:8800/RestaurantOrder/${selectedTable}`)
        .then(() => {
          alert(`Order for Table ${selectedTable} deleted successfully!`);
          setBill({ dishes: [], drinks: [] }); // Reset the bill
          setSelectedItems({ dishes: [], drinks: [] }); // Reset selected items
          setSelectedTable(null); // Deselect the table
        })
        .catch(err => {
          console.error('Error deleting order:', err);
          alert("Failed to delete the order.");
        });
    }
  };

  return (
    <div className="server-order-menu">
      <h2>Create Order</h2>
      <div className="table-selector">
        <h3>Select a Table</h3>
        <div className="table-buttons">
          {tables.map((table) => (
            <button
              key={table.Table_number}
              onClick={() => handleTableSelect(table.Table_number)}
            >
              Table {table.Table_number}
            </button>
          ))}
        </div>
      </div>

      {selectedTable && (
        <div className="menu-ordering">
          <h3>Ordering for Table {selectedTable}</h3>
          <div className="menu-grid">
            <div className="menu-box">
              <h4>Dishes</h4>
              {dishes.map(dish => (
                <button key={dish.Menu_number} onClick={() => handleAddItem(dish, 'dishes')}>
                  {dish.Item_name} - ${dish.Price}
                </button>
              ))}
            </div>

            <div className="menu-box">
              <h4>Drinks</h4>
              {drinks.map(drink => (
                <button key={drink.Menu_number} onClick={() => handleAddItem(drink, 'drinks')}>
                  {drink.Item_name} - ${drink.Price}
                </button>
              ))}
            </div>

            <div className="menu-box">
              <h4>Selected Items</h4>
              {selectedItems.dishes.length === 0 && selectedItems.drinks.length === 0
                ? <p>No items selected.</p>
                : (
                  <>
                    {selectedItems.dishes.map((item, index) => (
                      <div key={index}>
                        <span>{item.Item_name} - ${item.Price}</span>
                        <button onClick={() => handleRemoveItem(item, 'dishes')}>Remove</button>
                      </div>
                    ))}
                    {selectedItems.drinks.map((item, index) => (
                      <div key={index}>
                        <span>{item.Item_name} - ${item.Price}</span>
                        <button onClick={() => handleRemoveItem(item, 'drinks')}>Remove</button>
                      </div>
                    ))}
                  </>
                )}
            </div>
          </div>
          <button onClick={handleSubmitOrder}>Place Order</button>

          {/* Bill Section */}
          <div className="bill-box">
            <h3>Bill for Table {selectedTable}</h3>
            <div className="bill-items">
              {bill.dishes.length === 0 && bill.drinks.length === 0 ? (
                <p>No items ordered yet.</p>
              ) : (
                <>
                  {bill.dishes.map((item, index) => (
                    <div key={index}>
                      <span>{item.Dish_name}  - ${item.Price}</span>
                    </div>
                  ))}
                  {bill.drinks.map((item, index) => (
                    <div key={index}>
                      <span>{item.Drink_name}  - ${item.Price}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
            <h4>Total: ${calculateTotal()}</h4>
          </div>

          {/* Close Bill Button */}
          <button
            onClick={handleDeleteOrder}
            disabled={bill.dishes.length === 0 && bill.drinks.length === 0} // Disable if bill is empty
          >
            Close Bill
          </button>

        </div>
      )}
    </div>
  );
};

export default ServerOrderMenu;
