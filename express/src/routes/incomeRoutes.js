// src/routes/incomeRoutes.js
import express from "express";

import {
    createIncome,
    deleteIncome,
    getIncome,
    getIncomes,
    getIncomesByQuery,
    updateIncome,
} from "../controllers/incomeController.js";
import protect from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { incomeSchema, updateIncomeSchema } from "../validations/incomeValidation.js";
import { incomeQuerySchema } from "../validations/queryValidation.js";

const router = express.Router();

router.use(protect);

// POST create income
router.post("/", validate(incomeSchema), createIncome);

// GET Get all income based on account ID
// router.get("/account/:accountId", getIncomes); // Use it if want to view other people's account information
router.get("/", getIncomes);

// GET to get filtered revenue (filtered by category and time range)
router.get("/filter", validate(incomeQuerySchema, "query"), getIncomesByQuery);

// GET Get a single income based on income ID
router.get("/:id", getIncome);

// PATCH update income
router.patch("/:id", validate(updateIncomeSchema), updateIncome);

// DELETE delete income
router.delete("/:id", deleteIncome);

export default router;
