import mongoose from "mongoose";

import {
    createBudget,
    deleteBudget,
    getBudget,
    getBudgets,
    updateBudget,
} from "../controllers/budgetController";
import Budget from "../models/Budget";

jest.mock("../models/Budget");

const mockReq = {
    body: { name: "Budget", totalBudget: 100 },
    account: { _id: "user123" },
    params: { id: "budget123" },
    query: {},
};

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

const mockNext = jest.fn();

describe("Budget Controller", () => {
    afterEach(() => jest.clearAllMocks());

    it("should create budget successfully", async () => {
        const fakeBudget = { ...mockReq.body, account: "user123" };
        Budget.create.mockResolvedValue(fakeBudget);

        await createBudget(mockReq, mockRes, mockNext);

        expect(Budget.create).toHaveBeenCalledWith({ ...mockReq.body, account: "user123" });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(fakeBudget);
    });

    it("should handle Budget.create failure", async () => {
        const error = new Error("DB failed");
        Budget.create.mockRejectedValue(error);

        await createBudget(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should get budgets with no date filter", async () => {
        const budgets = [{ name: "Budget 1" }, { name: "Budget 2" }];
        Budget.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(budgets) });

        await getBudgets(mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith(budgets);
    });

    it("should handle Budget.find failure", async () => {
        Budget.find.mockImplementation(() => {
            throw new Error("fail");
        });

        await getBudgets(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it("should return a budget by ID", async () => {
        const budget = { _id: "budget123", name: "Budget" };
        Budget.findOne.mockResolvedValue(budget);

        await getBudget(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(budget);
    });

    it("should return 404 if budget not found", async () => {
        Budget.findOne.mockResolvedValue(null);

        await getBudget(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Budget not found" });
    });

    it("should update budget successfully", async () => {
        jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
        Budget.findOneAndUpdate.mockResolvedValue({ name: "Updated Budget" });

        await updateBudget(mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith({ name: "Updated Budget" });
    });

    it("should return 400 for invalid ID", async () => {
        const req = { ...mockReq, params: { id: "bad-id" } };
        jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

        await updateBudget(req, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid budget ID" });
    });

    it("should delete budget successfully", async () => {
        jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
        Budget.findOneAndDelete.mockResolvedValue({ _id: "budget123" });

        await deleteBudget(mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith({ message: "Budget deleted" });
    });

    it("should return 404 if budget not found", async () => {
        jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
        Budget.findOneAndDelete.mockResolvedValue(null);

        await deleteBudget(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Budget not found" });
    });
});
