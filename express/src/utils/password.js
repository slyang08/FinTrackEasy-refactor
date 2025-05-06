// src/utils/password.js
import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

export const isPasswordReused = async (newPassword, previousPasswords = []) => {
    for (const prev of previousPasswords) {
        const match = await bcrypt.compare(newPassword, prev.hash);
        if (match) return true;
    }
    return false;
};
