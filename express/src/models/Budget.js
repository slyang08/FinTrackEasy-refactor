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
        totalBudget: { type: Number, required: true, min: 0 },
        categories: [
            {
                categoryName: { type: String, required: true, index: true },
                allocatedAmount: { type: Number, required: true },
                spentAmount: { type: Number, default: 0, min: 0 },
            },
        ],
        dateRange: {
            start: { type: Date, required: true, index: true },
            end: { type: Date, required: true, index: true },
        },
        currency: { type: String, default: "CAD" },
        status: {
            type: String,
            enum: ["Active", "Closed", "Frozen"],
            default: "Active",
            index: true,
        },
    },
    { timestamps: true }
);

// Composite Index
budgetSchema.index({ account: 1, status: 1 });
budgetSchema.index({ account: 1, "dateRange.start": 1 });

export default mongoose.model("Budget", budgetSchema);
