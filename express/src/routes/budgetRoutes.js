import express from "express";

import {
    createBudget,
    deleteBudget,
    getBudget,
    getBudgets,
    updateBudget,
} from "../controllers/budgetController.js";
import protect from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { budgetSchema } from "../validations/budgetValidation.js";

const router = express.Router();

router.use(protect);

// Create a budget
router.post("/", validateBody(budgetSchema), createBudget);

// Get all budgets
router.get("/", getBudgets);

// Get a budgets
router.get("/:id", getBudget);

// Update the budget
router.patch("/:id", validateBody(budgetSchema), updateBudget);

// Delete the budget
router.delete("/:id", deleteBudget);

export default router;
