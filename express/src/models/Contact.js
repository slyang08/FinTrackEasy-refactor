// src/models/ContactForm.js
import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema(
    {
        name: { type: String },
        phone: {
            type: String,
            match: /^\d{10}$/,
        },
        email: {
            type: String,
            required: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        description: { type: String },
        type: {
            type: String,
            enum: ["general", "account-help"],
            // "general" indicates general contact (e.g. asking for service, cooperation consultation)
            // "account-help" is for login problems (from the Trouble logging in page)
            default: "general",
        },
        status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    },
    { timestamps: true }
);

export default mongoose.model("ContactForm", contactFormSchema);
