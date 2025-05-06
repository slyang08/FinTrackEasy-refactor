// src/routes/userRoutes.js
import express from "express";

import {
    deleteUser,
    getAllUsers,
    getMe,
    getUserById,
    updateProfile,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { updateProfileSchema } from "../validations/userValidation.js";

const router = express.Router();

// Authentication middleware - protects all routes
router.use(protect);

// CRUD protected by token
router.get("/", getAllUsers);
router.get("/me", getMe);
router.get("/:id", getUserById);
router.patch("/:id", validate(updateProfileSchema), updateProfile);
router.delete("/:id", deleteUser);

export default router;
