import express from "express";

import {
    createExpense,
    deleteExpense,
    filterExpenses,
    getExpense,
    getExpenseCategories,
    getExpenses,
    getExpensesByQuery,
    updateExpense,
} from "../controllers/expenseController.js";
import { attachAccount, authAny, optionalJwt } from "../middlewares/authMiddleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import { expenseSchema, updateExpenseSchema } from "../validations/expenseValidation.js";
import { expenseFilterQuerySchema, expenseQuerySchema } from "../validations/queryValidation.js";

const router = express.Router();

// Authentication middleware - protects all routes
router.use(optionalJwt, authAny, attachAccount);

// Create expenditure
router.post("/", validateBody(expenseSchema), createExpense);

// Get all expenditures (no filtering)
router.get("/", getExpenses);

router.get("/categories", getExpenseCategories);

router.get("/filter", validateQuery(expenseFilterQuerySchema), filterExpenses);

// Get expenses based on filter criteria (e.g. filter by category, year, month)
router.get("/query", validateQuery(expenseQuerySchema), getExpensesByQuery);

// Get a single expense based on the expense ID
router.get("/:id", getExpense);

// Update expenditure
router.patch("/:id", validateBody(updateExpenseSchema), updateExpense);

// Delete expenses
router.delete("/:id", deleteExpense);

export default router;
