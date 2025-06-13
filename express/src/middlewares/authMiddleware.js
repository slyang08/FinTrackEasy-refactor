// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

import Account from "../models/Account.js";
import User from "../models/User.js";

// JWT Mandatory Verification
export const protect = async (req, res, next) => {
// JWT Mandatory Verification
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await Account.findById(decoded.accountId).select("-password");

        if (!account) throw new Error("Account not found");

        // Check account status
        if (account.status !== "Active") {
            return res.status(403).json({ message: `Account is ${account.status}` });
        }

        // Get user
        const user = await User.findById(decoded.userId).lean();
        if (!user) return res.status(401).json({ message: "User not found" });

        req.userId = decoded.userId;
        req.account = account; // attach to request
        req.user = user;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Token failed or expired" });
    }
};

// Session authentication (passport)
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
}

// Optional JWT validation
export async function optionalJwt(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            req.accountId = decoded.accountId;
        } catch (err) {
            console.error("JWT verification failed:", err);
        }
    }
    next();
}

// Automatically hang accounts (for session authentication)
export async function attachAccount(req, res, next) {
    try {
        if (req.user && !req.account) {
            let account = await Account.findOne({ user: req.user._id });
            if (!account) {
                // Automatically create an account
                account = await Account.create({
                    user: req.user._id,
                    password: "google-oauth", // Marked with a special string
                    status: "Active",
                });
            }
            req.account = account;
        } else if (req.userId && !req.account) {
            let account = await Account.findById(req.accountId);
            if (!account) {
                return res.status(401).json({ message: "Account not found" });
            }
            req.account = account;
        }
        next();
    } catch (err) {
        next(err);
    }
}

// Supports either JWT or Session authentication.
export function authAny(req, res, next) {
    if (req.userId || (req.isAuthenticated && req.isAuthenticated()) || req.user) {
        return next();
    }
    res.status(401).json({ message: "Not authorized" });
}
