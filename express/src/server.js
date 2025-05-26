// express/server.js
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";

import connectDB from "./config/dbConnect.js";
import accountRoutes from "./routes/accountRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import savingRoutes from "./routes/savingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "./utils/googleOAuth.js";

const app = express();
const port = process.env.PORT;

// Connect to the database
connectDB();

// Middleware
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // or 'none' (cross-domain)
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/goals/:goalId/savings", savingRoutes);
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Hello from Express" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
});

// Catch all unhandled exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on("error", (err) => {
    console.error("Error starting server:", err);
});
