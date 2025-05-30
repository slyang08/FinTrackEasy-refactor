// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

import Account from "../models/Account.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
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

export default protect;
