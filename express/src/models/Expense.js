// src/models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true,
        },
        date: { type: Date, default: Date.now, index: true },
        category: {
            type: String,
            enum: [
                "Food & Drink",
                "Shopping",
                "Transport",
                "Home",
                "Bills & Fees",
                "Entertainment",
                "Groceries",
                "Car",
                "Travel",
                "Family & Personal",
                "Healthcare",
                "Other",
            ],
            required: true,
            index: true,
        },
        customCategory: {
            type: String,
            trim: true,
            required: function () {
                return this.category === "Other";
            },
        },
        amount: { type: Number, required: true, min: 0 },
        note: {
            type: String,
            trim: true,
            required: function () {
                return this.category === "Other";
            },
        },
        isRecurring: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Composite Index
expenseSchema.index({ account: 1, date: -1 });
expenseSchema.index({ account: 1, category: 1 });
expenseSchema.index({ account: 1, date: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);
