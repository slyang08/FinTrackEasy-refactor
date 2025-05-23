// src/utils/verificateEmail.js
import crypto from "crypto";

// New tool function
export const generateVerificationToken = () => {
    return {
        token: crypto.randomBytes(32).toString("hex"),
        expires: new Date(Date.now() + Number(process.env.VERIFICATION_EXPIRES || 3600000)), // 1 hour by default
    };
};

// Email template function
export const verificationContent = (verifyUrl, isResend = false) => `
    <h2>${isResend ? "New Verification Link" : "Welcome to register FinTrackEasy"}</h2>
    <p>Please click the link below to complete the email verification</p>
    <p>Your verification link expires in <strong>${process.env.VERIFICATION_EXPIRES ? process.env.VERIFICATION_EXPIRES / 3600000 : 1} hours</strong>:</p>
    <a href="${verifyUrl}" style="padding: 10px; background: #007bff; color: white; text-decoration: none;">Verify now</a>
    <p>Can't click? Copy this URL:<br/>${verifyUrl}</p>
`;
