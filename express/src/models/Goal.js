// src/models/Goal.js
import mongoose from "mongoose";

const savingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
    },
    { _id: true } // Each savings record has its own ID
);

const goalSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        targetAmount: { type: Number, required: true, min: 0 },
        currentSaving: { type: Number, default: 0, min: 0 },
        startDate: { type: Date, required: true },
        targetDate: { type: Date, required: true, index: true },
        savings: [savingSchema],
    },
    { timestamps: true }
);

// Composite Index
goalSchema.index({ account: 1, targetDate: 1 });

export default mongoose.model("Goal", goalSchema);
