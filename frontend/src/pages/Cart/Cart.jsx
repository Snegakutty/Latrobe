import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page has already been refreshed
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
      return; // Prevent further execution after reload
    }

    // Clear the refresh flag when leaving the cart page
    return () => {
      sessionStorage.removeItem("hasRefreshed");
    };
  }, []); // Empty dependency array so it only runs once on mount

  useEffect(() => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/");
      return;
    }

    const synth = window.speechSynthesis;

    // Construct the cart text
    const cartText = `Your cart contains the following items: ${food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => `${item.name} with quantity ${cartItems[item._id]}`)
      .join(", ")}.`;

    // Get the total amount and include it in the speech text
    const totalAmount = getTotalCartAmount();
    const totalText = `The total amount is ${totalAmount === 0 ? 0 : totalAmount + 5} Rupees. Can I proceed to checkout?`;

    // Combine the cart and total text
    const combinedText = cartText + " " + totalText;

    const utterance = new SpeechSynthesisUtterance(combinedText);
    utterance.onend = () => startVoiceRecognition();
    synth.cancel();
    synth.speak(utterance);

    return () => {
      synth.cancel();
    };
  }, [cartItems, food_list, navigate, getTotalCartAmount]);

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
      synth.cancel();

      if (transcript.includes("yes")) {
        const utterance = new SpeechSynthesisUtterance(
          "Your order has been placed."
        );
        synth.speak(utterance);

        utterance.onend = () => {
          navigate("/");
        };
      } else if (transcript.includes("no")) {
        const utterance = new SpeechSynthesisUtterance(
          "Redirecting to the home page."
        );
        synth.speak(utterance);

        utterance.onend = () => {
          navigate("/");
        };
      } else {
        const utterance = new SpeechSynthesisUtterance(
          "I didn't understand. Please say yes or no."
        );
        synth.speak(utterance);
        recognition.start();
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
      <div className="cart-items bg-orange-50 rounded-lg p-6">
        <div className="cart-items-title text-orange-800 font-semibold">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr className="border-orange-200" />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item hover:bg-orange-100 transition-colors">
                  <img src={`${url}/images/${item.image}`} alt="" className="rounded-lg shadow-sm" />
                  <p className="text-orange-900">{item.name}</p>
                  <p className="text-orange-700">{item.price}</p>
                  <div className="bg-orange-100 px-3 py-1 rounded-full text-orange-800">
                    {cartItems[item._id]}
                  </div>
                  <p className="text-orange-700">{item.price * cartItems[item._id]}</p>
                  <p
                    className="cart-items-remove-icon text-orange-500 hover:text-orange-700 cursor-pointer transition-colors"
                    onClick={() => removeFromCart(item._id)}
                  >
                    ×
                  </p>
                </div>
                <hr className="border-orange-200" />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total bg-orange-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Cart Totals</h2>
          <div>
            <div className="cart-total-details text-orange-700">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr className="border-orange-200 my-3" />
            <div className="cart-total-details text-orange-700">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr className="border-orange-200 my-3" />
            <div className="cart-total-details text-orange-900 font-bold">
              <p>Total</p>
              <p>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/order")}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode bg-orange-50 rounded-lg p-6 mt-6">
          <div>
            <p className="text-orange-800 font-medium mb-3">If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder="promo code" 
                className="border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg ml-2 transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
