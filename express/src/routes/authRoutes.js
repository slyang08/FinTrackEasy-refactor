// src/routes/authRoutes.js
import express from "express";

import {
    changePassword,
    forgotPassword,
    login,
    register,
    resendVerificationEmail,
    resetPassword,
    verifyEmail,
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import optionalJwt from "../middlewares/optionalJwt.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import validate from "../middlewares/validate.js";
import Account from "../models/Account.js";
import User from "../models/User.js";
import passport from "../utils/googleOAuth.js";
import { changePasswordSchema, resetPasswordSchema } from "../validations/accountValidation.js";
import { forgotPasswordSchema } from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Login successful, redirect to the front-end /oauth-callback
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback`);
    },
    (err) => {
        console.error("Authentication error:", err);
        res.status(500).json({ message: "Authentication failed", error: err });
    }
);

router.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            // Clear cookies
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                sameSite: "lax", // same as session setting
                secure: false, // same as session setting
            });
            res.status(200).json({ message: "Logged out" });
        });
    });
});

// Password Routes
router.patch("/:accountId/changepassword", protect, validate(changePasswordSchema), changePassword);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.patch("/:accountId/resetpassword", validate(resetPasswordSchema), resetPassword);

router.get("/me", optionalJwt, async (req, res) => {
    // JWT method
    if (req.userId) {
        try {
            // req.userId comes from protect middleware
            // Get user information
            const user = await User.findById(req.userId).lean();

            // Get all accounts belonging to this user
            const accounts = await Account.find({ user: req.userId }).lean();

            return res.json({ user, accounts });
        } catch (err) {
            return res.status(500).json({ message: "Failed to get user info" });
        }
    }

    // Session method
    if (req.isAuthenticated || req.isAuthenticated()) {
        return res.json({ user: req.user });
    }
    return res.status(401).json({ message: "Not logged in" });
});

export default router;
