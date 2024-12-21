import React, { useState } from "react";

const VoiceBot = () => {
  const [output, setOutput] = useState("");
  const [result, setResult] = useState("");

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
        const matchedItems = words.filter(word => itemNames.includes(word));
        console.log(matchedItems);

        if (matchedItems.length > 0) {
          fetch("http://localhost:5000/api/voice-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: matchedItems }), // Send matched items to backend
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Backend response:", data.items); // Display matched items from backend
              setResult(data.items.join(", "));
            })
            .catch((err) => {
              console.error("Error:", err);
              setResult("An error occurred while processing your request.");
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
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Voice Bot Shopping Cart</h1>
      <button onClick={startVoiceCommand}>Start Voice Command</button>
      <p>{output}</p>
      <p>{result}</p>
    </div>
  );
};

export default VoiceBot;



