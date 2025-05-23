// src/validations/savingValidation.js
import Joi from "joi";

// Validation schema for POST / PATCH saving
export const savingSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required",
    }),
    amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be greater than 0",
        "any.required": "Amount is required",
    }),
    date: Joi.date().optional().messages({
        "date.base": "Date must be a valid date",
    }),
});
