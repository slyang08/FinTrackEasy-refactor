// src/validations/expenseValidation.js
import Joi from "joi";

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

// Joi schema for expense validation
export const expenseSchema = Joi.object({
    account: Joi.string().required(),
    name: Joi.string().min(3).required(),
    date: Joi.date().default(Date.now),
    category: Joi.string()
        .valid(...expenseCategories)
        .required(),
    amount: Joi.number().min(0).required(),
    description: Joi.string().optional(),
    isRecurring: Joi.boolean().default(false),
});

export const updateExpenseSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    date: Joi.date().optional(),
    category: Joi.string()
        .valid(...expenseCategories)
        .optional(),
    amount: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
    isRecurring: Joi.boolean().optional(),
});
