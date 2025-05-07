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
        name: { type: String, required: true, minlength: 3 },
        date: { type: Date, default: Date.now, index: true },
        category: {
            type: String,
            enum: [
                "Groceries",
                "Gas",
                "Entertainment",
                "Bills",
                "Rent",
                "Utilities",
                "Food",
                "Other",
            ],
            required: true,
            index: true,
        },
        amount: { type: Number, required: true, min: 0 },
        description: { type: String, default: "", trim: true },
        isRecurring: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Composite Index
expenseSchema.index({ account: 1, date: -1 });
expenseSchema.index({ account: 1, category: 1 });
expenseSchema.index({ account: 1, date: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);
