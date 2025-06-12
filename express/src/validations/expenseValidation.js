// src/validations/expenseValidation.js
import Joi from "joi";

const expenseCategories = [
    "Food & Drink",
    "Shopping",
    "Transport",
    "Home",
    "Bills & Fees",
    "Entertainment",
    "Groceries",
    "Car",
    "Travel",
    "Family & Personal",
    "Healthcare",
    "Other",
];

// Joi schema for expense validation
export const expenseSchema = Joi.object({
    date: Joi.date().required(),
    category: Joi.string()
        .valid(...expenseCategories)
        .required(),
    amount: Joi.number().min(0).required(),
    customCategory: Joi.string().when("category", {
        is: "Other",
        then: Joi.string().min(1).required(),
        otherwise: Joi.forbidden(),
    }),
    note: Joi.string().when("category", {
        is: "Other",
        then: Joi.string().trim().min(1).required().messages({
            "any.required": "Note is required when category is 'Other'",
            "string.empty": "Note is required when category is 'Other'",
        }),
        otherwise: Joi.string().allow("", null).optional(),
    }),
    isRecurring: Joi.boolean().default(false),
});

export const updateExpenseSchema = Joi.object({
    date: Joi.date().optional(),
    category: Joi.string()
        .valid(...expenseCategories)
        .optional(),
    amount: Joi.number().min(0).optional(),
    customCategory: Joi.string().when("category", {
        is: "Other",
        then: Joi.string().min(1).required(),
        otherwise: Joi.forbidden(),
    }),
    note: Joi.string().when("category", {
        is: "Other",
        then: Joi.string().trim().min(1).required().messages({
            "any.required": "Note is required when category is 'Other'",
            "string.empty": "Note is required when category is 'Other'",
        }),
        otherwise: Joi.string().allow("", null).optional(),
    }),
    isRecurring: Joi.boolean().optional(),
});
