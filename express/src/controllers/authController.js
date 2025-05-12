// src/controllers/authController.js
import crypto from "crypto";

import Account from "../models/Account.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { isPasswordReused } from "../utils/password.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Register a new user
export const register = async (req, res) => {
    const { nickname, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const user = await User.create({ nickname, email, phone });
        const account = await Account.create({ user: user._id, password });

        const token = generateToken({ userId: user._id, accountId: account._id });

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
};

// @desc    Login user and return JWT token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Sorry, cannot find the user" });

        const account = await Account.findOne({ user: user._id }).select("+password");
        if (!account) return res.status(401).json({ message: "Sorry, cannot find the account" });

        const isMatch = await account.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Sorry, cannot match password" });

        const token = generateToken({ userId: user._id, accountId: account._id });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nickname: user.nickname,
                name: user.name,
                email: user.email,
                phone: user.phone,
                preferredLanguage: user.preferredLanguage,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Change account password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const accountId = req.params.accountId;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const account = await Account.findById(accountId).select(
            "+password previousPasswords user"
        );

        if (!account || !account.user || account.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const isMatch = await account.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Check if old password is reused (optional)
        if (await isPasswordReused(newPassword, account.previousPasswords)) {
            return res
                .status(400)
                .json({ message: "New password cannot be one of your previous passwords." });
        }

        // Store the old password (optional, it is recommended to store only the hash, not the plain text)
        account.previousPasswords = [
            ...(account.previousPasswords || []),
            { hash: account.password, changedAt: new Date() },
        ].slice(-5); // Only keep the last 5 times

        // Assign to new password
        account.password = newPassword;

        await account.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
};

// @desc    Send password reset link to user's email
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // For security reasons, return the same message
        return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    const account = await Account.findOne({ user: user._id });
    if (!account) {
        return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    account.passwordResetToken = token;
    account.passwordResetExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await account.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?accountId=${account._id}&token=${token}`;
    // await sendEmail(user.email, "Reset your password", `Click here to reset: ${resetUrl}`);
    await sendEmail(
        user.email,
        "Reset your password",
        `<p>Click <a href="${resetUrl}">here</a> to reset your password.<br/>If you did not request this, please ignore this email.</p>`
    );

    res.json({ message: "If this email exists, a reset link has been sent." });
};

// @desc    Reset account password
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        const { accountId } = req.params;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const account = await Account.findOne({
            _id: accountId,
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        }).select("+password");
        if (!account) return res.status(400).json({ message: "Invalid or expired token" });

        // You can add isAdmin judgment or verification process check
        account.password = newPassword;
        account.passwordResetToken = undefined;
        account.passwordResetExpires = undefined;
        await account.save();

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        next(err);
    }
};
