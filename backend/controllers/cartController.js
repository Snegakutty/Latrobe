import userModel from "../models/userModel.js"



const nameIdArray = [
   { "Carrot": "6762d75447a5bb7edf4ee841" },
   { "Beans": "6762d76c47a5bb7edf4ee843" },
   { "Onion": "6762d78147a5bb7edf4ee845" },
   { "Tomato": "6762d79c47a5bb7edf4ee847" },
   { "Potato": "6762d7b647a5bb7edf4ee849" },
   { "Cheese": "6762d7d947a5bb7edf4ee84b" },
   { "Orange": "6762d89347a5bb7edf4ee871" },
   { "Papaya": "6762d8b647a5bb7edf4ee874" },
   { "Banana": "6762d8ce47a5bb7edf4ee877" },
   { "Mango": "6762d8ec47a5bb7edf4ee87a" },
   { "Butter": "6762d91d47a5bb7edf4ee87e" },
   { "Curd": "6762d93a47a5bb7edf4ee881" },
   { "Milk": "6762d97647a5bb7edf4ee889" },
   { "Paneer": "6762d99047a5bb7edf4ee88c" },
   { "Sourdough": "6762d9bf47a5bb7edf4ee88f" },
   { "Wheat Bread": "6762d9e047a5bb7edf4ee892" },
   { "White Bread": "6762da0647a5bb7edf4ee895" },
   { "Whole grain bread": "6762da2a47a5bb7edf4ee898" },
   { "Britannia Bread": "6762da6f47a5bb7edf4ee89b" },
   { "Hide and seek": "6762db8447a5bb7edf4ee8a0" },
   { "Bourbon": "6762db9c47a5bb7edf4ee8a3" },
   { "Milk bikies": "6762dbb647a5bb7edf4ee8a6" },
   { "Timepass": "6762dbcc47a5bb7edf4ee8a9" },
   { "Oreo": "6762dbea47a5bb7edf4ee8ac" },
   { "Maggi": "6762f5e847a5bb7edf4ee8b3" },
   { "Instant Parota": "6762f61447a5bb7edf4ee8b6" },
   { "Corn Flakes": "6762f64f47a5bb7edf4ee8b9" },
   { "Oats": "6762f66f47a5bb7edf4ee8bc" },
   { "Idly batter": "6762f69d47a5bb7edf4ee8bf" },
   { "Basmati": "6762f80547a5bb7edf4ee8c4" },
   { "Ponni Rice": "6762f82847a5bb7edf4ee8c7" },
   { "Sivaji Brand": "6762f85247a5bb7edf4ee8ca" },
   { "Red Rice": "6762f87347a5bb7edf4ee8cd" },
   { "Black Rice": "6762f8f347a5bb7edf4ee8d0" },
   { "Fortune Oil": "6762fa4547a5bb7edf4ee8d5" },
   { "Gold winner": "6762fa7b47a5bb7edf4ee8d8" },
   { "Saffola": "6762faa347a5bb7edf4ee8db" },
   { "Sunland sunflower oil": "6762facb47a5bb7edf4ee8de" },
   { "Coconut Cooking Oil": "6762fb6c47a5bb7edf4ee8e2" },
   { "Apple": "67639133e7f600418e127ff4" },
 ];
 
// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({_id:req.body.userId});
      let cartData = await userData.cartData;
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      }
      else {
         cartData[req.body.itemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}





// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}


export { addToCart, removeFromCart, getCart }