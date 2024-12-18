import mongoose from "mongoose";

export const  connectDB = async () =>{
    await mongoose.connect('mongodb+srv://snegaofficialk:snegaofficialk@cluster0.45cf8.mongodb.net/Echom').then(()=>console.log("DB Connected"))
}

