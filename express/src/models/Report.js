// src/models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        reportType: {
            type: String,
            enum: ["Income vs. Expenses", "Budget Analysis", "Investment Performance"],
            required: true,
            index: true,
        },
        fileFormat: {
            type: String,
            enum: ["jpg", "png", "pdf"],
            required: true,
            index: true,
        },
        chartType: {
            type: String,
            enum: ["Graphical Charts", "Pie Charts", "Line Charts"],
            required: true,
            index: true,
        },
        totalIncome: { type: Number, required: true },
        totalExpense: { type: Number, required: true },
        savingGoal: { type: Number, required: true },
        currency: { type: String, default: "CAD" },
        dateRange: {
            start: { type: Date, required: true, index: true },
            end: { type: Date, required: true, index: true },
        },
    },
    { timestamps: true }
);

// Composite Index
reportSchema.index({ account: 1, reportType: 1, "dateRange.start": 1 });
reportSchema.index({ account: 1, "dateRange.start": 1, "dateRange.end": 1 });

export default mongoose.model("Report", reportSchema);
