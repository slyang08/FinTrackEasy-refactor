// src/middlewares/authAny.js
export default function authAny(req, res, next) {
    // Check JWT or Session authentication
    if (req.userId || (req.isAuthenticated && req.isAuthenticated()) || req.user) {
        return next();
    }
    res.status(401).json({ message: "Not authorized" });
}
