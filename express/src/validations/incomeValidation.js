// src/validations/incomeValidation.js
import Joi from "joi";

const incomeCategories = [
    "Salary",
    "Business",
    "Gift",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Insurance Payout",
    "Other",
];

// Joi schema for income validation
export const incomeSchema = Joi.object({
    date: Joi.date().required(),
    category: Joi.string()
        .valid(...incomeCategories)
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

export const updateIncomeSchema = Joi.object({
    date: Joi.date().optional(),
    category: Joi.string()
        .valid(...incomeCategories)
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
