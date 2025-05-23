// src/validations/userValidation.js
import Joi from "joi";

export const updateProfileSchema = Joi.object({
    nickname: Joi.string().min(2).max(30).optional(),

    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .message("Phone number must be exactly 10 digits")
        .optional(),

    preferredLanguage: Joi.string().valid("en", "fr").optional(),
}).unknown(false);

export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),
});
