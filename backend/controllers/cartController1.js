import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// Add to user cart by item name
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData;

        // Find food item by name
        const foodItem = await foodModel.findOne({ name: req.body.itemName });

        if (!foodItem) {
            return res.json({ success: false, message: "Item not found" });
        }

        // Update cartData with food name
        if (!cartData[foodItem.name]) {
            cartData[foodItem.name] = 1; // Add to cart with initial quantity of 1
        } else {
            cartData[foodItem.name] += 1; // Increment quantity
        }

        // Save updated cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food from user cart by item name
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        // Check if the item exists in the cart and reduce the quantity
        const foodItem = await foodModel.findOne({ name: req.body.itemName });

        if (!foodItem || !cartData[foodItem.name]) {
            return res.json({ success: false, message: "Item not in cart" });
        }

        if (cartData[foodItem.name] > 0) {
            cartData[foodItem.name] -= 1; // Decrease the quantity
        }

        // If quantity becomes 0, remove item from cart
        if (cartData[foodItem.name] === 0) {
            delete cartData[foodItem.name];
        }

        // Save updated cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Get user cart by item name and fetch food details
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        // Fetch food items details by name
        let cartItems = [];
        for (let itemName in cartData) {
            if (cartData[itemName] > 0) {
                let foodItem = await foodModel.findOne({ name: itemName });

                if (foodItem) {
                    cartItems.push({
                        ...foodItem.toObject(),
                        quantity: cartData[itemName],
                    });
                }
            }
        }

        // Return cart items with details
        res.json({ success: true, cartItems });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };
