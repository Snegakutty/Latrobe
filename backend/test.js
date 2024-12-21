import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Food from "./models/foodModel.js";
import { connectDB } from "./config/db.js";

// Load environment variables
dotenv.config();

connectDB();

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

// Temporary in-memory storage
let arr = [];

// Routes
// Test Route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// GET: Fetch Items from Voice Command
app.get("/api/voice-command", async (req, res) => {
  const itemNames = arr;

    try {
      // Fetch matching items from the database
      const items = await Food.find({ name: { $in: itemNames } });
      console.log(items)

      // Construct `details` array with matching items in `arr`
      const details = items.filter((food) => itemNames.includes(food.name));

      // Send the filtered items in the response
      res.status(200).json({ details });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } );


// POST: Add Items to Voice Command
app.post("/api/voice-command", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided." });
  }
  for (let i = 0; i < items.length; i++) {
    items[i] = items[i].charAt(0).toUpperCase() + items[i].slice(1).toLowerCase();
  }
  arr = arr.concat(items);
  console.log(arr);
  res.status(200).json({ message: "Items added successfully.", updatedList: arr });
});

// POST: Fetch Cart Items by Name




// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
