// src/models/Budget.js
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        category: { type: String, required: true, index: true },
        dateRange: {
            start: { type: Date, required: true, index: true },
            end: { type: Date, required: true, index: true },
        },
    },
    { timestamps: true }
);

// Composite Index
budgetSchema.index({ account: 1, status: 1 });
budgetSchema.index({ account: 1, "dateRange.start": 1 });

export default mongoose.model("Budget", budgetSchema);
