// src/routes/userRoutes.js
import express from "express";

import {
    deleteUser,
    getAllUsers,
    getMe,
    getUserById,
    updateProfile,
} from "../controllers/userController.js";
import authAny from "../middlewares/authAny.js";
import optionalJwt from "../middlewares/optionalJwt.js";
import validate from "../middlewares/validate.js";
import { updateProfileSchema } from "../validations/userValidation.js";

const router = express.Router();

// CRUD protected by token
router.get("/", authAny, getAllUsers);
router.get("/me", authAny, getMe);
router.get("/:id", authAny, getUserById);
router.patch("/:id", optionalJwt, authAny, validate(updateProfileSchema), updateProfile);
router.delete("/:id", deleteUser);

export default router;
