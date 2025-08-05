// src/jest.setup.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import { stopRecurringTransaction } from "./utils/postRecurringTransaction.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

import connectDB from "./config/dbConnect.js";

jest.setTimeout(30000);

beforeAll(async () => {
    // Execute the connection only if it is not connected (to avoid duplicates or race conditions).
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
});

jest.mock("passport-google-oauth20", () => {
    const Strategy = function (options, verify) {
        this.name = "google";
        this.authenticate = function (req) {
            // Simulate user information
            const user = { id: "123", name: "Unit Test" };
            this.success(user);
        };
    };
    return { Strategy };
});

// Mock email function to block external calls during testing
jest.mock("./utils/sendEmail.js", () => {
    return {
        __esModule: true,
        default: jest.fn().mockResolvedValue({ messageId: "mocked-message-id" }),
    };
});

jest.mock("google-auth-library", () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => {
            return {
                setCredentials: jest.fn(),
                getAccessToken: jest.fn().mockResolvedValue({ token: "mocked-access-token" }),
            };
        }),
    };
});

// At the end of the test, close the mongoose connection and stop scheduling.
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    stopRecurringTransaction();
});
