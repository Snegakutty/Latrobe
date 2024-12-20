import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
    const [fetchedItems, setFetchedItems] = useState([]); // To store matched items from the API
    const [cartItems, setCartItems] = useState({}); // Store cart items locally
    const navigate = useNavigate();

    // Fetch item names from the /api/voice-commands
    useEffect(() => {
        fetch("http://localhost:5000/api/voice-command", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(data => {
            // Extract the item names from the response
            const itemNames = data.itemNames || [];
            console.log(data);
            // Fetch item details based on the item names
            if (itemNames.length > 0) {
                fetch("http://localhost:4000/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemNames })
                })
                .then(res => res.json())
                .then(details => {
                    // Set the fetched item details in the state
                    setFetchedItems(details.items || []);
                })
                .catch(err => {
                    console.error("Error fetching item details:", err);
                });
            }
        })
        .catch((err) => {
            console.error("Error fetching voice commands:", err);
        });
    }, []);

    return (
        <div className="cart">
            <div className="cart-items">
                <h2>Cart Items</h2>
                {fetchedItems.length > 0 ? (
                    fetchedItems.map((item, index) => (
                        <div key={index} className="cart-item-card">
                            <img src={url + "/images/" + item.image} alt={item.name} />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Total: ${item.price * item.quantity}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.name)}>Remove</button>
                        </div>
                    ))
                ) : (
                    <p>No items in the cart</p>
                )}
            </div>

            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
