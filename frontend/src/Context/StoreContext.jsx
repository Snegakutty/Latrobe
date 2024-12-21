import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")


    const items = [
        { name: "Carrot", id: "6762d75447a5bb7edf4ee841" },
        { name: "Beans", id: "6762d76c47a5bb7edf4ee843" },
        { name: "Onion", id: "6762d78147a5bb7edf4ee845" },
        { name: "Tomato", id: "6762d79c47a5bb7edf4ee847" },
        { name: "Potato", id: "6762d7b647a5bb7edf4ee849" },
        { name: "Cheese", id: "6762d7d947a5bb7edf4ee84b" },
        { name: "Orange", id: "6762d89347a5bb7edf4ee871" },
        { name: "Papaya", id: "6762d8b647a5bb7edf4ee874" },
        { name: "Banana", id: "6762d8ce47a5bb7edf4ee877" },
        { name: "Mango", id: "6762d8ec47a5bb7edf4ee87a" },
        { name: "Butter", id: "6762d91d47a5bb7edf4ee87e" },
        { name: "Curd", id: "6762d93a47a5bb7edf4ee881" },
        { name: "Milk", id: "6762d97647a5bb7edf4ee889" },
        { name: "Paneer", id: "6762d99047a5bb7edf4ee88c" },
        { name: "Sourdough", id: "6762d9bf47a5bb7edf4ee88f" },
        { name: "Wheat Bread", id: "6762d9e047a5bb7edf4ee892" },
        { name: "White Bread", id: "6762da0647a5bb7edf4ee895" },
        { name: "Whole grain bread", id: "6762da2a47a5bb7edf4ee898" },
        { name: "Britannia Bread", id: "6762da6f47a5bb7edf4ee89b" },
        { name: "Hide and seek", id: "6762db8447a5bb7edf4ee8a0" },
        { name: "Bourbon", id: "6762db9c47a5bb7edf4ee8a3" },
        { name: "Milk bikies", id: "6762dbb647a5bb7edf4ee8a6" },
        { name: "Timepass", id: "6762dbcc47a5bb7edf4ee8a9" },
        { name: "Oreo", id: "6762dbea47a5bb7edf4ee8ac" },
        { name: "Maggi", id: "6762f5e847a5bb7edf4ee8b3" },
        { name: "Instant Parota", id: "6762f61447a5bb7edf4ee8b6" },
        { name: "Corn Flakes", id: "6762f64f47a5bb7edf4ee8b9" },
        { name: "Oats", id: "6762f66f47a5bb7edf4ee8bc" },
        { name: "Idly batter", id: "6762f69d47a5bb7edf4ee8bf" },
        { name: "Basmati", id: "6762f80547a5bb7edf4ee8c4" },
        { name: "Ponni Rice", id: "6762f82847a5bb7edf4ee8c7" },
        { name: "Sivaji Brand", id: "6762f85247a5bb7edf4ee8ca" },
        { name: "Red Rice", id: "6762f87347a5bb7edf4ee8cd" },
        { name: "Black Rice", id: "6762f8f347a5bb7edf4ee8d0" },
        { name: "Fortune Oil", id: "6762fa4547a5bb7edf4ee8d5" },
        { name: "Gold winner", id: "6762fa7b47a5bb7edf4ee8d8" },
        { name: "Saffola", id: "6762faa347a5bb7edf4ee8db" },
        { name: "Sunland sunflower oil", id: "6762facb47a5bb7edf4ee8de" },
        { name: "Coconut Cooking Oil", id: "6762fb6c47a5bb7edf4ee8e2" },
        { name: "Apple", id: "67639133e7f600418e127ff4" }
      ];
      
       const VaddItemsToCart = async ( itemNames) => {
        for (const name of itemNames) {
          const item = items.find((i) => i.name.toLowerCase() === name.toLowerCase());
          if (!item) {
            console.log(`Item not found: ${name}`);
            continue;
          }
      
          try {
            const response = await axios.post("http://localhost:4000/api/cart/add", 
                { itemId: item.id },
                { headers: { token } }
              
            );
      
            console.log(`Added item to cart: ${name} (ID: ${item.id})`);
            console.log("Response:", response.data);
          } catch (error) {
            console.error(`Error adding item: ${name} (ID: ${item.id})`, error);
          }
        }
      };
      

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        VaddItemsToCart,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;
