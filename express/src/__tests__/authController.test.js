// express/src/__tests__/authController.test.js
import passport from "passport";
import request from "supertest";

import app from "../app.js";
import Account from "../models/Account.js";
import User from "../models/User.js";

jest.mock("../models/User.js");
jest.mock("../models/Account.js");

describe("Login Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if user not found", async () => {
        User.findOne.mockResolvedValue(null); // Mock user not found

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Sorry, cannot find the user");
    });

    it("should return 401 if account not verified", async () => {
        const mockUser = { verified: false };
        User.findOne.mockResolvedValue(mockUser); // Mock user found but not verified

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Account not verified. Please check your email.");
    });

    it("should return 401 if password does not match", async () => {
        const mockUser = { verified: true };
        User.findOne.mockResolvedValue(mockUser);
        Account.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                comparePassword: jest.fn().mockResolvedValue(false),
                verified: true,
            }),
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "wrongpassword" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Sorry, cannot match password");
    });

    it("should return 200 and token if login is successful", async () => {
        const mockUser = {
            _id: "mockUserId",
            verified: true,
            email: "test@example.com",
            nickname: "unit-test",
            phone: "6479750982",
            preferredLanguage: "en",
        };
        User.findOne.mockResolvedValue(mockUser);
        Account.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                comparePassword: jest.fn().mockResolvedValue(true),
                _id: "mockAccountId",
                user: "mockUserId",
            }),
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        console.log(response.body.user);

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe("test@example.com"); // Adjust based on your user object
    });
});
