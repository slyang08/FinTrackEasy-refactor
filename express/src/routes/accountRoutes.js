// src/routes/accountRoutes.js
import express from "express";

import {
    changePassword,
    createAccount,
    deleteAccount,
    getMyAccounts,
    resetPassword,
    updateAccountStatus,
} from "../controllers/accountController.js";
import protect from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { changePasswordSchema, resetPasswordSchema } from "../validations/accountValidation.js";

const router = express.Router();

// Authentication middleware - protects all routes
router.use(protect);

// Password Routes
router.patch("/:id/change-password", validate(changePasswordSchema), changePassword);
router.patch("/:id/reset-password", validate(resetPasswordSchema), resetPassword);

// Login verification is required
router.get("/", getMyAccounts);
router.post("/", createAccount);
router.patch("/:id/status", updateAccountStatus);
router.delete("/:id", deleteAccount);

export default router;
