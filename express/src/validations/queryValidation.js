import Joi from "joi";

// General category options (you can also write them separately if you want to distinguish by category)
const incomeCategories = ["Pay", "Gift", "Other"];
const expenseCategories = [
    "Groceries",
    "Gas",
    "Entertainment",
    "Bills",
    "Rent",
    "Utilities",
    "Food",
    "Other",
];

// Income query verification
export const incomeQuerySchema = Joi.object({
    category: Joi.string()
        .valid(...incomeCategories)
        .optional(),
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
    date: Joi.date().iso().optional(), // If single-day query is supported
});

// Expenditure query verification
export const expenseQuerySchema = Joi.object({
    category: Joi.string()
        .valid(...expenseCategories)
        .optional(),
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
    date: Joi.date().iso().optional(),
});
