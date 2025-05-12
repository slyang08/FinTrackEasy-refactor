// src/validations/accountValidation.js
import Joi from "joi";

// Common password rules (you can add password strength requirements)
const passwordSchema = Joi.string().min(8).max(16).required();

export const changePasswordSchema = Joi.object({
    currentPassword: passwordSchema.label("Current Password"),
    newPassword: passwordSchema.label("New Password"),
    confirmPassword: Joi.valid(Joi.ref("newPassword"))
        .required()
        .label("Confirm Password")
        .messages({ "any.only": "Passwords do not match" }),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: passwordSchema.label("New Password"),
    confirmPassword: Joi.valid(Joi.ref("newPassword"))
        .required()
        .label("Confirm Password")
        .messages({ "any.only": "Passwords do not match" }),
});
