// src/utils/googleOAuth.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import Account from "../models/Account.js";
import User from "../models/User.js";

if (process.env.NODE_ENV !== "test") {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // You can check the database or create a new account here
                    let user = await User.findOne({ googleId: profile.id });
                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            nickname: profile.displayName,
                            verified: true,
                            // Other fields
                        });
                        await Account.create({
                            user: user._id,
                            password: "google-oauth", // Marked with a special string
                            status: "Active",
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    console.error("Error in Google OAuth strategy:", error);
                    return done(error);
                }
            }
        )
    );
}

export default passport;
