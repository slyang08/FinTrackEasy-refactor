// src/controllers/transactionController.js
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

/**
 * @desc    Get all transactions (income + expense)
 * @route   GET /api/transactions
 * @query   startDate, endDate, category (optional)
 * @access  Private
 */
export const getAllTransactions = async (req, res, next) => {
    try {
        const { startDate, endDate, category } = req.query;
        const match = { account: req.account._id };

        if (startDate && endDate) {
            match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) {
            match.category = category;
        }

        const [incomes, expenses] = await Promise.all([
            Income.find(match).lean(),
            Expense.find(match).lean(),
        ]);

        // 標記類型
        const transactions = [
            ...incomes.map((i) => ({ ...i, type: "income" })),
            ...expenses.map((e) => ({ ...e, type: "expense" })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions);
    } catch (err) {
        next(err);
    }
};
