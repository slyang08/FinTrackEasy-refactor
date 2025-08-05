import * as OverviewModule from "../../pages/Overview";

// Mock the exact module 'api/axios' that Overview uses
jest.mock("@/api/axios", () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Import the mocked api after jest.mock so it's properly mocked
import api from "@/api/axios";

describe("Overview module utilities", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Your existing fetchFilteredTransactions test
    it("fetchFilteredTransactions merges and sorts transactions correctly", async () => {
        api.get.mockImplementation((url) => {
            if (url.includes("incomes")) {
                return Promise.resolve({
                    data: [{ amount: 200, date: "2025-08-03T00:00:00Z", category: "Salary" }],
                });
            }
            // For expenses
            return Promise.resolve({
                data: [{ amount: 100, date: "2025-08-04T00:00:00Z", category: "Food & Drink" }],
            });
        });

        const from = new Date("2025-08-01");
        const to = new Date("2025-08-05");
        const selected = ["Salary", "Food & Drink"];

        const result = await OverviewModule.fetchFilteredTransactions(
            { from, to },
            selected,
            OverviewModule.allIncome,
            OverviewModule.allExpense
        );

        expect(result).toHaveLength(2);
        expect(result[0].amount).toBe(100); // Food & Drink, 2025-08-04
        expect(result[1].amount).toBe(200); // Salary, 2025-08-03
        expect(result[0].type).toBe("expense");
        expect(result[1].type).toBe("income");
    });

    // New test for useTransactionTotals
    it("useTransactionTotals calculates totals correctly", () => {
        const transactions = [
            { type: "income", amount: "100" },
            { type: "income", amount: "200" },
            { type: "expense", amount: "50" },
            { type: "expense", amount: "25" },
        ];

        const { totalIncome, totalExpenses, balance } =
            OverviewModule.useTransactionTotals(transactions);

        expect(totalIncome).toBe(300);
        expect(totalExpenses).toBe(75);
        expect(balance).toBe(225);
    });

    // New test for mergeAndSortTransactions
    it("mergeAndSortTransactions merges and sorts by date descending", () => {
        const incomes = [
            { amount: 100, date: "2025-08-01T00:00:00Z" },
            { amount: 200, date: "2025-08-03T00:00:00Z" },
        ];
        const expenses = [
            { amount: 50, date: "2025-08-02T00:00:00Z" },
            { amount: 25, date: "2025-07-31T00:00:00Z" },
        ];

        const result = OverviewModule.mergeAndSortTransactions(incomes, expenses);

        expect(result).toHaveLength(4);
        expect(result[0].date).toBe("2025-08-03T00:00:00Z");
        expect(result[1].date).toBe("2025-08-02T00:00:00Z");
        expect(result[2].date).toBe("2025-08-01T00:00:00Z");
        expect(result[3].date).toBe("2025-07-31T00:00:00Z");
    });

    // New test for fetchIncomes
    it("fetchIncomes fetches data and adds type", async () => {
        api.get.mockResolvedValue({
            data: [{ amount: 150, date: "2025-08-01" }],
        });

        const params = { startDate: "2025-08-01", endDate: "2025-08-05" };
        const result = await OverviewModule.fetchIncomes(params);

        expect(api.get).toHaveBeenCalledWith("/incomes/filter", { params });
        expect(result).toEqual([{ amount: 150, date: "2025-08-01", type: "income" }]);
    });

    // New test for fetchExpenses
    it("fetchExpenses fetches data and adds type", async () => {
        api.get.mockResolvedValue({
            data: [{ amount: 75, date: "2025-08-01" }],
        });

        const params = { startDate: "2025-08-01", endDate: "2025-08-05" };
        const result = await OverviewModule.fetchExpenses(params);

        expect(api.get).toHaveBeenCalledWith("/expenses/filter", { params });
        expect(result).toEqual([{ amount: 75, date: "2025-08-01", type: "expense" }]);
    });
});
