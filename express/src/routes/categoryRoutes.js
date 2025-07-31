// routes/categoryRoutes.js
import express from "express";

import {
    getAllCategories,
    getCategoriesForPeriod,
    getCategoryStats,
} from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { TorontoTimeMiddleware } from "../middlewares/timeMiddleware.js";

const router = express.Router();

router.use(protect, TorontoTimeMiddleware);

router.get("/", getAllCategories);
router.get("/stats", getCategoryStats);
router.get("/period", getCategoriesForPeriod);

export default router;
