// src/routes/authRoutes.js
import express from "express";

import {
    changePassword,
    forgotPassword,
    getMe,
    googleAuth,
    googleCallback,
    login,
    logout,
    register,
    resendVerificationEmail,
    resetPassword,
    setCookie,
    verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import { TorontoTimeMiddleware } from "../middlewares/timeMiddleware.js";
import validate from "../middlewares/validate.js";
import { changePasswordSchema, resetPasswordSchema } from "../validations/accountValidation.js";
import { forgotPasswordSchema } from "../validations/userValidation.js";

const router = express.Router();

router.use(TorontoTimeMiddleware);

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/google", googleAuth);

router.get("/google/callback", googleCallback);

router.post("/set-cookie", setCookie);

// Protect the /me route
router.get("/me", protect, getMe);
router.get("/logout", logout);

// Password Routes
router.patch("/:accountId/changepassword", protect, validate(changePasswordSchema), changePassword);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.patch("/:accountId/resetpassword", validate(resetPasswordSchema), resetPassword);

export default router;
