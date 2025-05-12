// src/routes/authRoutes.js
import express from "express";

import { changePassword, forgotPassword, resetPassword } from "../controllers/authController.js";
import { login, register } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import validate from "../middlewares/validate.js";
import Account from "../models/Account.js";
import User from "../models/User.js";
import { changePasswordSchema, resetPasswordSchema } from "../validations/accountValidation.js";
import { forgotPasswordSchema } from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

// Password Routes
router.patch("/:accountId/changepassword", protect, validate(changePasswordSchema), changePassword);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.patch("/:accountId/resetpassword", validate(resetPasswordSchema), resetPassword);

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
