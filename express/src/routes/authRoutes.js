// src/routes/authRoutes.js
import express from "express";

import {
    changePassword,
    forgotPassword,
    getMe,
    googleCallback,
    login,
    logout,
    register,
    resendVerificationEmail,
    resetPassword,
    verifyEmail,
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import optionalJwt from "../middlewares/optionalJwt.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import validate from "../middlewares/validate.js";
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
    googleCallback,
    (err) => {
        console.error("Authentication error:", err);
        res.status(500).json({ message: "Authentication failed", error: err });
    }
);

router.get("/logout", logout);

// Password Routes
router.patch("/:accountId/changepassword", protect, validate(changePasswordSchema), changePassword);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.patch("/:accountId/resetpassword", validate(resetPasswordSchema), resetPassword);

router.get("/me", optionalJwt, getMe);

export default router;
