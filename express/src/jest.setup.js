// src/jest.setup.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
dotenv.config();

import connectDB from "./config/dbConnect.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});
