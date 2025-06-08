// src/controllers/categoryController.js
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

/**
 * @desc    Get all categories for filter dropdown
 * @route   GET /api/categories
 * @access  Private
 */
export const getAllCategories = async (req, res, next) => {
    try {
        const [incomeCategories, expenseCategories] = await Promise.all([
            Income.distinct("category", { account: req.account._id }),
            Expense.distinct("category", { account: req.account._id }),
        ]);

        res.json({
            income: incomeCategories.sort(),
            expense: expenseCategories.sort(),
            all: [...new Set([...incomeCategories, ...expenseCategories])].sort(),
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get category statistics for dashboard
 * @route   GET /api/categories/stats
 * @access  Private
 */
export const getCategoryStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter =
            startDate && endDate
                ? {
                      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
                  }
                : {};

        // Income stats by category
        const incomeStats = await Income.aggregate([
            { $match: { account: req.account._id, ...dateFilter } },
            { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]);

        // Expense stats by category
        const expenseStats = await Expense.aggregate([
            { $match: { account: req.account._id, ...dateFilter } },
            { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]);

        res.json({
            income: incomeStats,
            expense: expenseStats,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get categories used in a specific period (for filter dropdown)
 * @route   GET /api/categories/period
 * @query   startDate, endDate
 * @access  Private
 */
export const getCategoriesForPeriod = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate are required" });
        }
        const dateFilter = {
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
            account: req.account._id,
        };

        // Obtain the type of income/expenditure for the period
        const [incomeCategories, expenseCategories] = await Promise.all([
            Income.distinct("category", dateFilter),
            Expense.distinct("category", dateFilter),
        ]);

        // Merge, de-duplicate, sort
        const categories = Array.from(new Set([...incomeCategories, ...expenseCategories])).sort();

        res.json(categories);
    } catch (err) {
        next(err);
    }
};
