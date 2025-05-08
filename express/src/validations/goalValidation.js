import Joi from "joi";

// Goal creation and update validation rules
export const goalSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    targetAmount: Joi.number().positive().required().messages({
        "number.base": "Target Amount must be a positive number",
        "any.required": "Target Amount is required",
    }),
    currentSaving: Joi.number().optional().default(0),
    dateRange: Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
    }).required(),
});
