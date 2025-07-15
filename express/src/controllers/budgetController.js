// src/controllers/budgetController.js
import mongoose from "mongoose";

import Budget from "../models/Budget.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/budgets
 * @desc    Create a new budget for the authenticated user
 * @access  Private
 */
export const createBudget = async (req, res, next) => {
    try {
        const budget = await Budget.create({ ...req.body, account: req.account._id });
        res.status(201).json(budget);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets of the authenticated user
 * @access  Private
 */
export const getBudgets = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { account: req.account._id };

        if (startDate && endDate) {
            filter["dateRange.start"] = { $lte: new Date(endDate) };
            filter["dateRange.end"] = { $gte: new Date(startDate) };
        }

        const budgets = await Budget.find(filter).sort({ createdAt: -1 });
        res.json(budgets);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   GET /api/budgets/:id
 * @desc    Get a single budget by ID for the authenticated user
 * @access  Private
 */
export const getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, account: req.account._id });
        if (!budget) return res.status(404).json({ error: "Budget not found" });
        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route   PATCH /api/budgets/:id
 * @desc    Update a budget for the authenticated user
 * @access  Private
 */
export const updateBudget = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid budget ID" });
        }

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!budget) return res.status(404).json({ message: "Budget not found" });

        res.json(budget);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a budget for the authenticated user
 * @access  Private
 */
export const deleteBudget = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid budget ID" });
        }

        const deleted = await Budget.findOneAndDelete({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!deleted) return res.status(404).json({ message: "Budget not found" });

        res.json({ message: "Budget deleted" });
    } catch (err) {
        next(err);
    }
};
