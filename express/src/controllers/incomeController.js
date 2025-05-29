// src/controllers/incomeController.js
import mongoose from "mongoose";

import Income from "../models/Income.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create an Income
 * @route   POST /api/incomes
 * @access  Private (valid JWT required)
 */
export const createIncome = async (req, res, next) => {
    try {
        const { name, date, amount, category, description } = req.body;

        const income = await Income.create({
            name,
            date,
            amount,
            category,
            description,
            account: req.account._id,
        });
        res.status(201).json(income);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all Incomes
 * @route   GET /api/incomes
 * @access  Private (valid JWT required)
 */
export const getIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.find({ account: req.account._id }).sort({ date: -1 });
        res.json(incomes);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all Incomes (with optional query filters)
 * @route   GET /api/incomes/query?category=&year=&month=
 * @access  Private (valid JWT required)
 */
export const getIncomesByQuery = async (req, res, next) => {
    try {
        const query = { account: req.account._id };

        // Optional: category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Optional: month/year filter (format: ?year=2025&month=04)
        if (req.query.year && req.query.month) {
            const year = parseInt(req.query.year);
            const month = parseInt(req.query.month) - 1;

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59);

            query.date = { $gte: startDate, $lte: endDate };
        }

        const incomes = await Income.find(query).sort({ date: -1 });
        res.json(incomes);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get single Income by ID
 * @route   GET /api/incomes/:id
 * @access  Private (valid JWT required)
 */
export const getIncome = async (req, res) => {
    try {
        const income = await Income.findOne({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!income) return res.status(404).json({ error: "Income not found" });

        res.status(200).json(income);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Update an Income by ID
 * @route   PUT /api/incomes/:id
 * @access  Private (valid JWT required)
 */
export const updateIncome = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid income ID" });
        }

        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!income) return res.status(404).json({ message: "Income not found" });

        res.json(income);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete an Income by ID
 * @route   DELETE /api/incomes/:id
 * @access  Private (valid JWT required)
 */
export const deleteIncome = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid income ID" });
        }

        const deleted = await Income.findOneAndDelete({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!deleted) return res.status(404).json({ message: "Income not found" });

        res.json({ message: "Income deleted" });
    } catch (err) {
        next(err);
    }
};
