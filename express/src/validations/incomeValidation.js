// src/validations/incomeValidation.js
import Joi from "joi";

const incomeCategories = ["Pay", "Gift", "Other"];

// Joi schema for income validation
export const incomeSchema = Joi.object({
    account: Joi.string().required(),
    name: Joi.string().min(3).required(),
    date: Joi.date().default(Date.now),
    category: Joi.string()
        .valid(...incomeCategories)
        .required(),
    amount: Joi.number().min(0).required(),
    description: Joi.string().optional(),
    isRecurring: Joi.boolean().default(false),
});

export const updateIncomeSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    date: Joi.date().optional(),
    category: Joi.string()
        .valid(...incomeCategories)
        .optional(),
    amount: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
    isRecurring: Joi.boolean().optional(),
});
