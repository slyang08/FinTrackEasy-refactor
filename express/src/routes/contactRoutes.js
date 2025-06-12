// src/routes/contactRoutes.js
import express from "express";

import {
    getAllContacts,
    getContactById,
    submitContactForm,
    updateContactStatus,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { generalContactSchema } from "../validations/contactValidation.js";

const router = express.Router();

// Public routes
router.post("/", validate(generalContactSchema), submitContactForm);

router.use(protect);

// Admin-only or team routes (can be protected later)
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.patch("/:id", updateContactStatus);

export default router;
