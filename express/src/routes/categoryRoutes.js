// routes/categoryRoutes.js
import express from "express";

import {
    getAllCategories,
    getCategoriesForPeriod,
    getCategoryStats,
} from "../controllers/categoryController.js";
import { authAny, optionalJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(optionalJwt, authAny);

router.get("/", getAllCategories);
router.get("/stats", getCategoryStats);
router.get("/period", getCategoriesForPeriod);

export default router;
