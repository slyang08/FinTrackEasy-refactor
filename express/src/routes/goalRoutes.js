import express from "express";

import {
    createGoal,
    deleteGoal,
    getGoal,
    getGoals,
    updateGoal,
} from "../controllers/goalController.js";
import { attachAccount, optionalJwt } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { goalSchema } from "../validations/goalValidation.js";

const router = express.Router();

router.use(optionalJwt, attachAccount);

// Create target
router.post("/", validateBody(goalSchema), createGoal);

// Get all targets
router.get("/", getGoals);

// Get a target
router.get("/:id", getGoal);

// Update the target
router.patch("/:id", validateBody(goalSchema), updateGoal);

// Delete the target
router.delete("/:id", deleteGoal);

export default router;
