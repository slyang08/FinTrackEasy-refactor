import express from "express";

import { login, register } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import Account from "../models/Account.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

router.get("/me", protect, async (req, res) => {
    try {
        // req.userId comes from protect middleware
        // Get user information
        const user = await User.findById(req.userId).lean();

        // Get all accounts belonging to this user
        const accounts = await Account.find({ user: req.userId }).lean();

        res.json({ user, accounts });
    } catch (err) {
        res.status(500).json({ message: "Failed to get user info" });
    }
});

export default router;
