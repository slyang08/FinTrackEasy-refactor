// src/routes/accountRoutes.js
import express from "express";

import {
    createAccount,
    deleteAccount,
    getMyAccounts,
    updateAccountStatus,
} from "../controllers/accountController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Authentication middleware - protects all routes
router.use(protect);

// Login verification is required
router.get("/", getMyAccounts);
router.post("/", createAccount);
router.patch("/:id/status", updateAccountStatus);
router.delete("/:id", deleteAccount);

export default router;
