import express from "express";

import {
    createGoal,
    deleteGoal,
    getGoal,
    getGoals,
    updateGoal,
} from "../controllers/goalController.js";
import { validateBody } from "../middlewares/validate.js";
import { goalSchema } from "../validations/goalValidation.js";

const router = express.Router();

// Create target
router.post("/", validateBody(goalSchema), createGoal);

// Get all targets
router.get("/", getGoals);

// Get a target
router.get("/", getGoal);

// Update the target
router.patch("/:id", validateBody(goalSchema), updateGoal);

// Delete the target
router.delete("/:id", deleteGoal);

export default router;
