// src/validations/contactValidation.js
import Joi from "joi";

export const generalContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    note: Joi.string().allow(null, ""),
    termsAccepted: Joi.boolean().valid(true).required(),
});
