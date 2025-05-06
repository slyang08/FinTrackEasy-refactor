// express/server.js
import cors from "cors";
import express from "express";

import connectDB from "./config/dbConnect.js";
import accountRoutes from "./routes/accountRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT;

// Connect to the database
connectDB();

// Middleware
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
