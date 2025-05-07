// src/controllers/incomeController.js
import mongoose from "mongoose";

import Income from "../models/Income.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create an Income
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

// @desc    Get all Incomes
export const getIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.find({ account: req.account._id }).sort({ date: -1 });
        res.json(incomes);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all Incomes (with optional query filters)
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

// @desc    Get single income
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

// @desc    Update an Income
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

// @desc    Delete an Income
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
