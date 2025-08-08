// src/routes/incomeRoutes.js
import express from "express";

import {
    createIncome,
    deleteIncome,
    filterIncomes,
    getIncome,
    getIncomeCategories,
    getIncomes,
    getIncomesByQuery,
    updateIncome,
} from "../controllers/incomeController.js";
import { attachAccount, protect } from "../middlewares/authMiddleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import { incomeSchema, updateIncomeSchema } from "../validations/incomeValidation.js";
import { incomeFilterQuerySchema, incomeQuerySchema } from "../validations/queryValidation.js";

const router = express.Router();

router.use(protect, attachAccount);

// POST create income
router.post("/", validateBody(incomeSchema), createIncome);

// GET Get all income based on account ID
router.get("/", getIncomes);

router.get("/categories", getIncomeCategories);

router.get("/filter", validateQuery(incomeFilterQuerySchema), filterIncomes);

// GET to get filtered revenue (filtered by category and time range)
router.get("/filter", validateQuery(incomeQuerySchema), getIncomesByQuery);

// GET Get a single income based on income ID
router.get("/:id", getIncome);

// PATCH update income
router.patch("/:id", validateBody(updateIncomeSchema), updateIncome);

// DELETE delete income
router.delete("/:id", deleteIncome);

export default router;
