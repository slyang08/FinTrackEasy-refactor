// src/controllers/expenseController.js
import mongoose from "mongoose";

import Expense from "../models/Expense.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create an Expense
 * @route   POST /api/expenses
 * @access  Private (valid JWT required)
 */
export const createExpense = async (req, res, next) => {
    try {
        const { name, date, amount, category, description, isRecurring } = req.body;

        const expense = await Expense.create({
            name,
            date,
            amount,
            category,
            description,
            isRecurring,
            account: req.account._id,
        });
        res.status(201).json(expense);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all Expenses
 * @route   GET /api/expenses
 * @access  Private (valid JWT required)
 */
export const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ account: req.account._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all Expenses (with optional query filters)
 * @route   GET /api/expenses/query
 * @access  Private (valid JWT required)
 * @query   category, year, month
 */
export const getExpensesByQuery = async (req, res, next) => {
    try {
        const query = { account: req.account._id };

        // Optional: filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Optional: filter by year and month
        if (req.query.year && req.query.month) {
            const year = parseInt(req.query.year);
            const month = parseInt(req.query.month) - 1;

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59);

            query.date = { $gte: startDate, $lte: endDate };
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get single Expense
 * @route   GET /api/expenses/:id
 * @access  Private (valid JWT required)
 */
export const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!expense) return res.status(404).json({ error: "Expense not found" });
        res.status(200).json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Update an Expense
 * @route   PUT /api/expenses/:id
 * @access  Private (valid JWT required)
 */
export const updateExpense = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) return res.status(404).json({ message: "Expense not found" });

        res.json(expense);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete an Expense
 * @route   DELETE /api/expenses/:id
 * @access  Private (valid JWT required)
 */
export const deleteExpense = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        const deleted = await Expense.findOneAndDelete({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!deleted) return res.status(404).json({ message: "Expense not found" });

        res.json({ message: "Expense deleted" });
    } catch (err) {
        next(err);
    }
};
