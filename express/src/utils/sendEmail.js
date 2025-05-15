// src/utils/sendEmail.js
import pkg from "google-auth-library";
const { OAuth2Client } = pkg;
import nodemailer from "nodemailer";

const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER } = process.env;

const oAuth2Client = new OAuth2Client(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);

oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken();
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: GMAIL_USER,
            clientId: GMAIL_CLIENT_ID,
            clientSecret: GMAIL_CLIENT_SECRET,
            refreshToken: GMAIL_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });
}

export default async function sendEmail(to, subject, html) {
    const transporter = await createTransporter();
    const mailOptions = {
        from: `"FinTrackEasy" <${GMAIL_USER}>`,
        to,
        subject,
        html,
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
