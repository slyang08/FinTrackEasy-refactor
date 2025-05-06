// src/middlewares/validate.js

// General authentication middleware
/**
 * Joi verification intermediary layer
 * Usage:
 * validateBody(schema)
 * validateQuery(schema)
 * validateParams(schema)
 * Or use directly:
 * validate(schema, "body" | "query" | "params")
 */
const validate =
    (schema, type = "body") =>
    (req, res, next) => {
        const data = req[type]; // type can be "body", "query", "params"
        const { error } = schema.validate(data, { abortEarly: false });

        if (error) {
            const messages = error.details.map((detail) => detail.message);
            return res.status(400).json({ errors: messages });
        }

        next();
    };

export const validateBody = (schema) => validate(schema, "body");
export const validateQuery = (schema) => validate(schema, "query");
export const validateParams = (schema) => validate(schema, "params");

export default validate;
