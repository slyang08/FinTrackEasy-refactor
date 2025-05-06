// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        nickname: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        phone: {
            type: String,
            match: /^\d{10}$/,
        },
        preferredLanguage: {
            type: String,
            enum: ["en", "fr"],
            default: "en",
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
