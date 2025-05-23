// src/middlewares/rateLimit.js
import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        errorType: "RATE_LIMIT",
        code: "REGISTER_LIMIT",
        message: "Too many registration attempts. Try again later.",
    },
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        errorType: "RATE_LIMIT",
        code: "LOGIN_ATTEMPT_LIMIT",
        message: "Too many login attempts. Please try again in 15 minutes.",
    },
});

export const passwordChangeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        errorType: "RATE_LIMIT",
        code: "PASSWORD_RESET_LIMIT",
        message: "Too many password change attempts. Please try again later.",
    },
});
