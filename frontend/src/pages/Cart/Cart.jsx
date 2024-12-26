import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page has already reloaded in this session
    const hasReloaded = sessionStorage.getItem("cartReloaded");

    if (!hasReloaded) {
      // Set the reload flag and reload the page
      sessionStorage.setItem("cartReloaded", "true");
      window.location.reload();
      return;
    }

    // Continue with the rest of the logic if the page is not reloading
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/"); // Redirect to home if the cart is empty
      return;
    }

    const synth = window.speechSynthesis;

    const cartText = `Your cart contains the following items: ${food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => `${item.name} with quantity ${cartItems[item._id]}`)
      .join(", ")}. Can I proceed to checkout?`;

    const utterance = new SpeechSynthesisUtterance(cartText);
    utterance.onend = () => startVoiceRecognition();
    synth.cancel(); // Cancel any ongoing speech before speaking
    synth.speak(utterance);

    return () => {
      synth.cancel(); // Cleanup ongoing speech on unmount
    };
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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log("User said:", transcript);

      const synth = window.speechSynthesis;
      synth.cancel(); // Cancel any ongoing speech before speaking new output

      if (transcript.includes("yes")) {
        const utterance = new SpeechSynthesisUtterance(
          "Your order has been placed."
        );
        synth.speak(utterance);

        utterance.onend = () => {
          navigate("/"); // Navigate to the order page after confirmation
        };
      } else if (transcript.includes("no")) {
        const utterance = new SpeechSynthesisUtterance(
          "Redirecting to the home page."
        );
        synth.speak(utterance);

        utterance.onend = () => {
          navigate("/"); // Navigate to the home page
        };
      } else {
        const utterance = new SpeechSynthesisUtterance(
          "I didn't understand. Please say yes or no."
        );
        synth.speak(utterance);
        recognition.start(); // Restart voice recognition for clarification
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      alert("An error occurred during voice recognition.");
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
                  <img src={`${url}/images/${item.image}`} alt="" />
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
          return null;
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
