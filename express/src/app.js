// express/src/app.js
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import connectDB from "./config/dbConnect.js";
import accountRoutes from "./routes/accountRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import savingRoutes from "./routes/savingRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "./utils/googleOAuth.js";
import recurringTransaction from "./utils/postRecurringTransaction.js";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log("Loaded env file:", envFile);
const app = express();

if (process.env.NODE_ENV !== "test") {
    app.set("trust proxy", 1);
}

// Middleware
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Initialize Passport
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals/:goalId/savings", savingRoutes);
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Hello from Express" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Something broke!" });
});

// Catch all unhandled exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

// Run recurring job
recurringTransaction();

export default app;
