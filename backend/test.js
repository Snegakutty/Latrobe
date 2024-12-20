import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// Connect to MongoDB
export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://snegaofficialk:snegaofficialk@cluster0.45cf8.mongodb.net/Echom')
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB connection error:", err));
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Body parser middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define the cart schema and model
const cartSchema = new mongoose.Schema({
  item: { type: String, required: true, unique: true },
});

const Cart = mongoose.model("Cart", cartSchema);
let arr=[];
// API endpoint to handle voice commands

app.get('/', (req, res) => {
  res.send("HI");
});
app.get("/api/voice-command", (req, res) => {
    res.json({ items: arr }); // Return the array of items as JSON
  });
app.post("/api/voice-command", async (req, res) => {
  const { items } = req.body; // Accept an array of items

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided." });
    }else{
        arr.concat(items);
        console.log();
    }

    

    // Send all messages in the response
    res.json({ message: "added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while processing." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
