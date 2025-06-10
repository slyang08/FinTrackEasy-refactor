import express from "express";

import {
    createExpense,
    deleteExpense,
    getExpense,
    getExpenses,
    getExpensesByQuery,
    updateExpense,
} from "../controllers/expenseController.js";
import {
    attachAccount,
    ensureAuthenticated,
    optionalJwt,
    protect,
} from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { expenseSchema, updateExpenseSchema } from "../validations/expenseValidation.js";
import { expenseQuerySchema } from "../validations/queryValidation.js";

const router = express.Router();

// Authentication middleware - protects all routes
router.use(ensureAuthenticated, attachAccount);

// Create expenditure
router.post("/", validate(expenseSchema), createExpense);

// Get all expenditures (no filtering)
router.get("/", getExpenses);

// Get expenses based on filter criteria (e.g. filter by category, year, month)
router.get("/filter", validate(expenseQuerySchema), getExpensesByQuery);

// Get a single expense based on the expense ID
router.get("/:id", getExpense);

// Update expenditure
router.patch("/:id", validate(updateExpenseSchema), updateExpense);

// Delete expenses
router.delete("/:id", deleteExpense);

export default router;
