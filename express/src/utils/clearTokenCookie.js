// src/utils/clearTokenCookie.js
export function clearTokenCookie(res) {
    res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
}
