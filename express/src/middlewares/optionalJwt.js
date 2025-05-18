// src/middlewares/optionalJwt.js
import jwt from "jsonwebtoken";

export default async function optionalJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId || decoded.id;
        } catch (err) {
            // If the token is invalid, skip it and continue with the session
        }
    }
    next();
}
