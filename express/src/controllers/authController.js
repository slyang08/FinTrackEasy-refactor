// src/controllers/authController.js
import crypto from "crypto";

import Account from "../models/Account.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { isPasswordReused } from "../utils/password.js";
import sendEmail from "../utils/sendEmail.js";
import { generateVerificationToken, verificationContent } from "../utils/verificateEmail.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
    const { nickname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (user) {
            if (user.verified) {
                return res.status(400).json({ message: "Email already exists" });
            }
            user.nickname = nickname;
        } else {
            // New user
            user = new User({ nickname, email });
            isNewUser = true;
        }

        // Generate/Update verification token
        const { token, expires } = generateVerificationToken();
        user.verificationToken = token;
        user.verificationTokenExpires = expires;
        await user.save();

        // Create Account for new users only
        if (isNewUser) {
            await Account.create({ user: user._id, password });
        }

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;
        await sendEmail(
            email,
            "【FinTrackEasy】Please verify your email",
            verificationContent(verifyUrl)
        );

        // Respond to the client (do not directly return the token)
        res.status(isNewUser ? 201 : 200).json({
            message: isNewUser
                ? "Registration successful! Please check your mailbox to complete the verification"
                : "Email not verified. A new verification email has been sent.",
            userId: user._id,
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
};

/**
 * @desc   Verify email address
 * @route  GET /api/auth/verify-email
 * @access public
 */
export const verifyEmail = async (req, res) => {
    const { token, id } = req.query;

    try {
        // Find the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
            });
        }

        // Already verified
        if (user.verified) {
            return res.json({
                success: true,
                message: "Already verified!",
                data: {
                    redirectUrl: "/login",
                    autoRedirect: true,
                },
            });
        }

        // Check token validity
        if (user.verificationToken !== token) {
            return res.status(400).json({
                message: "Verification code is invalid",
            });
        }

        // Check timeliness
        if (user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({
                message: "The verification link has expired, please reapply",
            });
        }

        // Update verification status
        user.verified = true;
        user.verificationToken = undefined; // Clear used token
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: "Verification successful!",
            data: {
                redirectUrl: "/login",
                autoRedirect: true,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred during verification",
            error: err.message,
        });
    }
};

/**
 * @desc   Resend verification email
 * @route  POST /api/auth/resend-verification
 * @access Public
 */
export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Security considerations: Do not prompt the user whether the
            return res.json({
                message: "If the email exists, a new verification link has been sent.",
            });
        }

        // If it has been verified
        if (user.verified) {
            return res.status(400).json({
                message: "This email is already verified.",
                code: "ALREADY_VERIFIED", // Add an error code for front-end identification
            });
        }

        // Regenerate token
        const { token, expires } = generateVerificationToken();

        // Update user information
        user.verificationToken = token;
        user.verificationTokenExpires = expires;
        await user.save();

        // Combined verification link
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;

        // Send email
        await sendEmail(
            email,
            "【Resend verification email】Please verify your mailbox",
            verificationContent(verifyUrl, true)
        );

        res.json({
            message: "If the email exists, a new verification link has been sent.",
            retryAfter: 300, // It is recommended that the front-end limit cannot be resent within 5 minutes
        });
    } catch (err) {
        console.error(`[ResendError] ${email}: ${err.message}`);
        res.status(500).json({
            message: "Error resending verification email",
            error: err.message,
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Sorry, cannot find the user" });

        // Add validation check
        if (!user.verified) {
            return res.status(401).json({
                message: "Account not verified. Please check your email.",
            });
        }

        const account = await Account.findOne({ user: user._id }).select("+password");
        if (!account) return res.status(401).json({ message: "Sorry, cannot find the account" });

        const isMatch = await account.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Sorry, cannot match password" });

        const token = generateToken({ userId: user._id, accountId: account._id });
        // Set the token in a cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "lax", // Adjust as necessary
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
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

/**
 * @desc    Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleCallback = (req, res) => {
    // Login successful, redirect to the front-end /oauth-callback
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback`);
};

/**
 * @desc    Get current user info (JWT or Session)
 * @route   GET /api/auth/me
 * @access  Private (JWT or Session)
 */
export const getMe = async (req, res) => {
    // JWT method
    if (req.userId) {
        try {
            // req.userId comes from protect middleware
            // Get user information
            const user = await User.findById(req.userId).lean();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Get all accounts belonging to this user
            const accounts = await Account.find({ user: req.userId }).lean();
            return res.json({ user, accounts });
        } catch (err) {
            return res.status(500).json({ message: "Failed to get user info" });
        }
    }

    // Session method
    if (typeof req.isAuthenticated === "function" && req.isAuthenticated()) {
        return res.json({ user: req.user });
    }
    return res.status(401).json({ message: "Not logged in" });
};

/**
 * @desc   Change account password
 * @route  PUT /api/auth/change-password/:accountId
 * @access Private (valid JWT required)
 */
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

/**
 * @desc    Send password reset link to user's email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
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

/**
 * @desc    Reset account password
 * @route   POST /api/auth/reset-password/:accountId
 * @access  Public
 */
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

/**
 * @desc    Logout user (clear JWT cookie and/or session)
 * @route   GET /api/auth/logout
 * @access  Private
 */
export const logout = (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            // Clear cookies
            const cookieOptions = {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            };
            res.clearCookie("connect.sid", cookieOptions);
            res.clearCookie("token", cookieOptions);
            res.status(200).json({ message: "Logged out" });
        });
    });
};
