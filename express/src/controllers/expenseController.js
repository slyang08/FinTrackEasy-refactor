// src/controllers/expenseController.js
import mongoose from "mongoose";

import Expense from "../models/Expense.js";
import { expenseSchema, updateExpenseSchema } from "../validations/expenseValidation.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create an Expense
 * @route   POST /api/expenses
 * @access  Private (valid JWT required)
 */
export const createExpense = async (req, res, next) => {
    try {
        const { error, value } = expenseSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ messages: error.details.map((e) => e.message) });
        }

        if (value.date) {
            value.date = new Date(value.date);
        }

        const expenseData = {
            ...value,
            account: req.account._id,
        };

        const expense = await Expense.create(expenseData);
        res.status(201).json(expense);
    } catch (err) {
        console.error("Error creating expense:", err);
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
 * @desc    Get all used expense categories for the current user in a date range
 * @route   GET /api/expenses/categories?startDate=2025-01-01&endDate=2025-06-30
 * @query   startDate, endDate
 * @access  Private
 */
export const getExpenseCategories = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { account: req.account._id };

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lt: new Date(endDate),
            };
        }

        const categories = await Expense.distinct("category", filter);
        res.json(categories.sort());
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Filter expense records by date range and multiple categories
 * @route   GET /api/expenses/filter or /api/expenses/filter?startDate=2025-01-01&endDate=2025-06-30&categories=Salary,Business
 * @query   startDate, endDate, categories
 * @access  Private
 */
export const filterExpenses = async (req, res, next) => {
    try {
        const { startDate, endDate, categories } = req.query;
        const filter = { account: req.account._id };

        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lt: new Date(endDate) };
        }
        if (categories) {
            filter.category = { $in: categories.split(",") };
        }

        const expenseResults = await Expense.find(filter);
        res.json(expenseResults);
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
 * @route   PATCH /api/expenses/:id
 * @access  Private (valid JWT required)
 */
export const updateExpense = async (req, res, next) => {
    try {
        console.log("req.body:", req.body);
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        const { error, value } = updateExpenseSchema.validate(req.body, { abortEarly: false });
        if (error) {
            console.log("Joi error:", error.details);
            return res.status(400).json({ messages: error.details.map((e) => e.message) });
        }

        const updateData = { ...value };
        const unsetData = {};

        console.log("updateData.note:", updateData.note);
        if (updateData.category && updateData.category !== "Other") {
            unsetData.customCategory = "";
        }

        if (
            !("note" in req.body) ||
            req.body.note === null ||
            req.body.note === undefined ||
            req.body.note === ""
        ) {
            unsetData.note = "";
            delete updateData.note;
        }

        // Combine the update commands
        const updateObj =
            Object.keys(unsetData).length > 0
                ? { $set: updateData, $unset: unsetData }
                : updateData;

        console.log("updateObj:", updateObj);
        console.log("before _id:", req.params.id);
        console.log("account._id:", req.account._id);

        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            updateObj,
            { new: true, runValidators: true, timestamps: true }
        );
        console.log("after _id:", req.params.id);
        console.log("account._id:", req.account._id);

        if (!expense) return res.status(404).json({ message: "Expense not found" });

        console.log("Updated expense note:", expense.note);
        res.json(expense);
    } catch (err) {
        console.log("Server error:", err);
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
