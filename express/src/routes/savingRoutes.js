// src/routes/savingRoutes.js
import express from "express";

import {
    addSaving,
    deleteSaving,
    getSavings,
    updateSaving,
} from "../controllers/savingController.js";
import { attachAccount, optionalJwt } from "../middlewares/authMiddleware.js";
import { TorontoTimeMiddleware } from "../middlewares/timeMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { savingSchema } from "../validations/savingValidation.js";

const router = express.Router({ mergeParams: true }); // Make req.params.goalId available

router.use(optionalJwt, attachAccount, TorontoTimeMiddleware);

router.get("/", getSavings);
router.post("/", validateBody(savingSchema), addSaving);
router.patch("/:savingId", validateBody(savingSchema), updateSaving);
router.delete("/:savingId", deleteSaving);

export default router;
