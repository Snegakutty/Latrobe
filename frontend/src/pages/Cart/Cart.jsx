import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the cart is not empty
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/"); // Redirect to home if the cart is empty
      return;
    }

    const synth = window.speechSynthesis;
    const cartText = `Your cart contains the following items: ${food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => `${item.name} (Quantity: ${cartItems[item._id]})`)
      .join(", ")}. Can I proceed to checkout?`;

    const utterance = new SpeechSynthesisUtterance(cartText);
    utterance.onend = () => {
      startVoiceRecognition(); // Start listening for user response once the speech ends
    };

    synth.speak(utterance);
  }, [cartItems, food_list, navigate]);

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log("User said:", transcript);

      if (transcript.includes("yes")) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance("Your order has been placed.");
        synth.speak(utterance);
        navigate("/order"); // Navigate to order confirmation page
      } else if (transcript.includes("no")) {
        navigate("/"); // Redirect to home page if no
      } else {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(
          "I didn't understand. Please say yes or no."
        );
        synth.speak(utterance);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognition.start();
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p
                    className="cart-items-remove-icon"
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
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
              <p>{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
