// src/validations/contactValidation.js
import Joi from "joi";

export const generalContactSchema = Joi.object({
    name: Joi.string().allow(null, ""),
    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .message("Phone number must be 10 digits")
        .allow(null, ""),
    email: Joi.string().email().required(),
    description: Joi.string().allow(null, ""),
});

export const troubleLoginSchema = Joi.object({
    email: Joi.string().email().required(),
});
