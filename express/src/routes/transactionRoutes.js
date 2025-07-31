// src/routes/transactionRoutes.js
import express from "express";

import { getAllTransactions } from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { TorontoTimeMiddleware } from "../middlewares/timeMiddleware.js";

const router = express.Router();

router.use(protect, TorontoTimeMiddleware);

router.get("/", getAllTransactions);

export default router;
