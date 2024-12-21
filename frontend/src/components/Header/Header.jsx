import React, { useState ,useContext} from "react";
import "./Header.css";
import { StoreContext } from '../../Context/StoreContext'// Import the updated addItemsToCart function 

const Header = () => {
  const [output, setOutput] = useState("");
  const [result, setResult] = useState("");
   const {VaddItemsToCart} = useContext(StoreContext);

  const itemNames = [
    "carrot", "beans", "onion", "tomato", "potato", "cheese", "orange",
    "papaya", "banana", "mango", "butter", "curd", "milk", "paneer", 
    "sourdough", "wheat bread", "white bread", "whole grain bread", 
    "britannia bread", "hide and seek", "bourbon", "milk bikies", "timepass", 
    "oreo", "maggi", "instant parota", "corn flakes", "oats", "idly batter", 
    "basmati", "ponni rice", "sivaji brand", "red rice", "black rice", 
    "fortune oil", "gold winner", "saffola", "sunland sunflower oil", 
    "coconut cooking oil", "apple"
  ];

  // Updated addItemsToCart function

  const startVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setOutput("Listening...");
      console.log("Speech recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (transcript) {
        setOutput(`You said: "${transcript}"`);

        const words = transcript.split(" ");
        const matchedItems = words.filter((word) => itemNames.includes(word));
        console.log("Matched Items:", matchedItems);

        if (matchedItems.length > 0) {

          
          VaddItemsToCart(matchedItems).then(() => {
            setResult("Items added to cart successfully.");
          }).catch((err) => {
            console.error("Error adding items to cart:", err);
            setResult("An error occurred while adding items to the cart.");
          });
        } else {
          setResult("No matching items found.");
        }
      } else {
        setOutput("No speech detected. Please try again.");
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setResult("Speech recognition failed. Please try again.");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    recognition.start();
    // Add SpeechSynthesis to say "Place your orders"
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance("Place your orders");
    synth.speak(utterance);
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
        </p>
        <button onClick={startVoiceCommand}>Voice Bot</button>
        <p>{output}</p>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default Header;
