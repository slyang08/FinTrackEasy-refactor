// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

import Account from "../models/Account.js";

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
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

        req.userId = decoded.userId;
        req.account = account; // attach to request
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Token failed or expired" });
    }
};

export default protect;
