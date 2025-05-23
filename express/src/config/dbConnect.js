// src/config/dbConnect.js
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
    // Check if you are already connected
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection
    .once("open", () => {
        console.log("MongoDB connection successful!");
    })
    .on("error", (err) => {
        console.log("MongoDB connection error:", err);
    });

connectDB();

export default connectDB;
