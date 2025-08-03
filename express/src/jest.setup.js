// src/jest.setup.js
import mongoose from "mongoose";

import connectDB from "./config/dbConnect.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});
