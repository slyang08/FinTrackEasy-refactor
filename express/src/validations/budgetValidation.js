import Joi from "joi";

// Budget creation and update validation rules
export const budgetSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    totalBudget: Joi.number().positive().required().messages({
        "number.base": "Total Budget must be a positive number",
        "any.required": "Total Budget is required",
    }),
    categories: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Categories must be an array",
        "any.required": "Categories are required",
    }),
    dateRange: Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
    }).required(),
    currency: Joi.string().optional(),
    status: Joi.string().valid("Active", "Closed").optional(),
});
