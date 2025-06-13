// src/models/Income.js
import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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
                "Salary",
                "Business",
                "Gift",
                "Extra Income",
                "Loan",
                "Parental Leave",
                "Insurance Payout",
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
incomeSchema.index({ account: 1, date: -1 });
incomeSchema.index({ account: 1, date: 1, category: 1 });

export default mongoose.model("Income", incomeSchema);
