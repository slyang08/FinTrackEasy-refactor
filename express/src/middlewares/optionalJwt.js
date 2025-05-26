// src/middlewares/optionalJwt.js
import jwt from "jsonwebtoken";

export default async function optionalJwt(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // 從 Cookie 或 Authorization 標頭中獲取 Token

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId; // 將 userId 附加到請求中
        } catch (err) {
            console.error("JWT verification failed:", err);
        }
    }
    next();
}
