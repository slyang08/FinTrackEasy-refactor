import express from "express";

import { login, register } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

// Protected route example — can be expanded later
router.get("/me", protect, (req, res) => {
    // Here req.account and req.userId are brought in from protect middleware
    res.json({
        message: "Welcome to your profile",
        userId: req.userId,
        account: req.account,
    });
});

export default router;
