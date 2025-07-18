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
    currentSaving: Joi.number().min(0).required().messages({
        "number.base": "Current Saving must be a number",
        "any.required": "Current Saving is required",
    }),
    startDate: Joi.date().iso().required().messages({
        "date.base": "Start Date must be a valid date",
        "any.required": "Start Date is required",
    }),
    targetDate: Joi.date().iso().required().messages({
        "date.base": "Target Date must be a valid date",
        "any.required": "Target Date is required",
    }),
});
