// src/utils/sendEmail.js
import nodemailer from "nodemailer";

// You can put these settings in a .env file
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // For example, smtp.gmail.com
    port: process.env.SMTP_PORT, // 465 (SSL) or 587 (TLS)
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER, // Our email
        pass: process.env.SMTP_PASS, // Our email password or app password
    },
});

export default async function sendEmail(to, subject, html) {
    // from can customize the brand name, we can use fintrackeasy or fte
    const mailOptions = {
        from: `"FinTrackEasy" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html, // Support html format
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}
