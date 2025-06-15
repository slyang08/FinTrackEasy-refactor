// src/controllers/incomeController.js
import mongoose from "mongoose";

import Income from "../models/Income.js";
import { incomeSchema, updateIncomeSchema } from "../validations/incomeValidation.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create an Income
 * @route   POST /api/incomes
 * @access  Private (valid JWT required)
 */
export const createIncome = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: "No account found in request" });
        }

        const { error, value } = incomeSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ messages: error.details.map((e) => e.message) });
        }

        const incomeData = {
            ...value,
            account: req.account._id,
        };

        const income = await Income.create(incomeData);
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
 * @desc    Get all used income categories for the current user in a date range
 * @route   GET /api/incomes/categories?startDate=2025-01-01&endDate=2025-06-30
 * @query   startDate, endDate
 * @access  Private
 */
export const getIncomeCategories = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { account: req.account._id };

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            };
        }

        const categories = await Income.distinct("category", filter);
        res.json(categories.sort());
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Filter income records by date range and multiple categories
 * @route   GET /api/incomes/filter or /api/incomes/filter?startDate=2025-01-01&endDate=2025-06-30&categories=Salary,Business
 * @query   startDate, endDate, categories
 * @access  Private
 */
export const filterIncomes = async (req, res, next) => {
    try {
        const { startDate, endDate, categories } = req.query;
        const filter = { account: req.account._id };

        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lt: new Date(endDate) };
        }
        if (categories) {
            filter.category = { $in: categories.split(",") };
        }

        const incomeResults = await Income.find(filter);
        res.json(incomeResults);
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

        const { error, value } = updateIncomeSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ messages: error.details.map((e) => e.message) });
        }

        const updateData = { ...value };
        const unsetData = {};

        if (updateData.category && updateData.category !== "Other") {
            unsetData.customCategory = "";
        }

        if ("note" in updateData && (updateData.note === null || updateData.note === "")) {
            unsetData.note = "";
            delete updateData.note;
        }

        const updateObj =
            Object.keys(unsetData).length > 0
                ? { $set: updateData, $unset: unsetData }
                : updateData;

        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            updateObj,
            { new: true, runValidators: true, timestamps: true }
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
