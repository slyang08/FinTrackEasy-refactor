import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";

import api from "@/api/axios";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import TransactionForm from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import BudgetSummary from "../components/budget/BudgetSummary";
import CategoryFilter from "../components/CategoryFilter";
import SummarySection from "../components/SummarySection";
import TransactionDateFilter from "../components/TransactionDateFilter";
import TransactionList from "../components/TransactionList";

// Dictionaries for sorting filtered categories for incomes and expenses
export const allIncome = [
    "Gift",
    "Salary",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Business",
    "Insurance Payout",
    "Other",
];

export const allExpense = [
    "Food & Drink",
    "Car",
    "Shopping",
    "Bills & Fees",
    "Home",
    "Entertainment",
    "Travel",
    "Healthcare",
    "Family & Personal",
    "Transport",
    "Other",
];

// Customize Hook: Calculate Total Income, Total Expenses, Balance
function useTransactionTotals(transactions) {
    const totalIncome = transactions
        .filter((txn) => txn.type === "income")
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

    const totalExpenses = transactions
        .filter((txn) => txn.type === "expense")
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
}

// Consolidation and sequencing transactions
function mergeAndSortTransactions(incomes, expenses) {
    return [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Obtaining income/expenditure information
async function fetchIncomes(params) {
    const res = await api.get("/incomes/filter", { params });
    return res.data.map((txn) => ({ ...txn, type: "income" }));
}

async function fetchExpenses(params) {
    const res = await api.get("/expenses/filter", { params });
    return res.data.map((txn) => ({ ...txn, type: "expense" }));
}

// Filter transactions by date and classification
async function fetchFilteredTransactions(dateRange, selectedCategories, allIncome, allExpense) {
    if (!dateRange?.from || !dateRange?.to) {
        console.warn("Skipping fetch: dateRange is incomplete", dateRange);
        return [];
    }

    // Date handling: to ISO string
    const startLocal = new Date(dateRange.from);
    startLocal.setHours(0, 0, 0, 0);
    const startDate = new Date(
        startLocal.getTime() - startLocal.getTimezoneOffset() * 60000
    ).toISOString();

    const endLocal = new Date(dateRange.to);
    endLocal.setHours(0, 0, 0, 0);
    endLocal.setDate(endLocal.getDate() + 1);
    const endDate = new Date(
        endLocal.getTime() - endLocal.getTimezoneOffset() * 60000
    ).toISOString();

    const incomeCategories = selectedCategories.filter((c) => allIncome.includes(c));
    const expenseCategories = selectedCategories.filter((c) => allExpense.includes(c));

    const incomeParams = { startDate, endDate };
    const expenseParams = { startDate, endDate };

    // Only add categories if there is a selection
    if (incomeCategories.length > 0) {
        incomeParams.categories = incomeCategories.join(",");
    }

    if (expenseCategories.length > 0) {
        expenseParams.categories = expenseCategories.join(",");
    }

    // Always fetch both
    const [incomes, expenses] = await Promise.all([
        fetchIncomes(incomeParams),
        fetchExpenses(expenseParams),
    ]);

    return mergeAndSortTransactions(incomes, expenses);
}

export default function Overview() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    useEffect(() => {
        console.log("Selected Categories State:", selectedCategories);
    }, [selectedCategories]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Default date range to today
    const today = new Date();
    const [dateRange, setDateRange] = useState({
        from: today,
        to: today,
    });

    const { totalIncome, totalExpenses, balance } = useTransactionTotals(transactions);

    useEffect(() => {
        fetchFilteredTransactions(dateRange, selectedCategories, allIncome, allExpense)
            .then(setTransactions)
            .catch(console.error);
    }, [dateRange, selectedCategories, refreshTrigger]);

    // Debug
    useEffect(() => {
        console.log("Selected categories updated:", selectedCategories);
    }, [selectedCategories]);

    useEffect(() => {
        console.log("Date range updated:", {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString(),
        });
    }, [dateRange]);

    const openDialog = (entryType) => {
        setType(entryType);
        setOpen(true);
    };

    const handleEdit = (txn) => {
        setEditingData(txn);
        setEditingId(txn._id);
        setType(txn.type);
        setOpen(true);
    };

    const handleDelete = (txn) => {
        setSelectedDelete(txn);
        setConfirmDelete(true);
    };

    const confirmDeleteEntry = async () => {
        try {
            const endpoint = selectedDelete.type === "income" ? "/incomes" : "/expenses";
            await api.delete(`${endpoint}/${selectedDelete._id}`);
            setConfirmDelete(false);
            setSelectedDelete(null);
            setRefreshTrigger((prev) => prev + 1);
            toast.success("Entry deleted successfully");
        } catch (err) {
            toast.error("Failed to delete entry");
            console.error(err);
        }
    };

    const handleFormClose = () => {
        setOpen(false);
        setEditingData(null);
        setEditingId(null);
        setRefreshTrigger((prev) => prev + 1);
    };

    // Prepare dynamic datasets for charts
    const incomeTransactions = transactions.filter((txn) => txn.type === "income");
    const expenseTransactions = transactions.filter((txn) => txn.type === "expense");

    const incomeData = groupTransactionsByDateAndCategory(incomeTransactions);
    const expenseData = groupTransactionsByDateAndCategory(expenseTransactions);

    function groupTransactionsByDateAndCategory(transactions) {
        const grouped = {};
        const allCategories = new Set();

        // First pass: collect categories
        transactions.forEach((txn) => {
            const category =
                txn.category === "Other" && txn.customCategory ? txn.customCategory : txn.category;

            allCategories.add(category);
        });

        // Second pass: group by date and category
        transactions.forEach((txn) => {
            const dateKey = format(new Date(txn.date), "MMM dd");
            const category =
                txn.category === "Other" && txn.customCategory ? txn.customCategory : txn.category;

            if (!grouped[dateKey]) {
                grouped[dateKey] = { date: dateKey };

                // Initialize all categories to 0 for this date
                allCategories.forEach((cat) => {
                    grouped[dateKey][cat] = 0;
                });
            }

            grouped[dateKey][category] += Number(txn.amount);
        });

        // Convert grouped object to sorted array
        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-8">
                        <Button
                            variant="income"
                            onClick={() => openDialog("income")}
                            className="cursor-pointer w-30"
                        >
                            Add Income
                        </Button>
                        <Button
                            variant="expense"
                            onClick={() => openDialog("expense")}
                            className="cursor-pointer"
                        >
                            Add Expense
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <TransactionDateFilter
                            dateRange={dateRange}
                            onChange={(range) => {
                                if (!range?.from || !range?.to) {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    setDateRange({ from: today, to: today });
                                } else {
                                    setDateRange(range);
                                }
                            }}
                        />
                    </div>
                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        dateRange={dateRange}
                        onChange={setSelectedCategories}
                        refreshTrigger={refreshTrigger}
                    ></CategoryFilter>{" "}
                </div>

                {/* Summary Cards */}
                <SummarySection balance={balance} income={totalIncome} expenses={totalExpenses} />
                {/* Generate Report Button TO DO: Implement functionality*/}
                <div className="grid justify-items-end">
                    <Button variant="report" className="cursor-pointer">
                        Generate Report
                    </Button>
                </div>
                {/* Charts */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                    <div className="bg-white shadow-lg rounded-lg p-8 h-80 w-full md:w-[90%]">
                    <div className="sticky top-0 left-0 right-0 bg-white z-20 text-center text-[18px] font-semibold mb-2">
                        Income 
                    </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={incomeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {incomeData.length > 0 &&
                                    Object.keys(incomeData[0])
                                        .filter((key) => key !== "date")
                                        .map((category, idx) => (
                                            <Line
                                                key={category}
                                                type="monotone"
                                                dataKey={category}
                                                stroke={
                                                    [
                                                        "#4ade80",
                                                        "#22d3ee",
                                                        "#10b981",
                                                        "#3b82f6",
                                                        "#facc15",
                                                    ][idx % 5]
                                                }
                                                strokeWidth={2}
                                                activeDot={{ r: 6 }}
                                            />
                                        ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-8 h-80 w-full md:w-[90%]">
                        <div className="sticky top-0 left-0 right-0 bg-white z-20 text-center text-[18px] font-semibold mb-2">
                            Expenses
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expenseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {expenseData.length > 0 &&
                                    Object.keys(expenseData[0])
                                        .filter((key) => key !== "date")
                                        .map((category, idx) => (
                                            <Line
                                                key={category}
                                                type="monotone"
                                                dataKey={category}
                                                stroke={
                                                    [
                                                        "#ef4444",
                                                        "#f97316",
                                                        "#eab308",
                                                        "#8b5cf6",
                                                        "#ec4899",
                                                    ][idx % 5]
                                                }
                                                strokeWidth={2}
                                                activeDot={{ r: 6 }}
                                            />
                                        ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions + Budgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transactions */}
                    <TransactionList
                        transactions={transactions.map((txn) => ({
                            ...txn,
                            displayCategory:
                                txn.category === "Other" && txn.customCategory
                                    ? txn.customCategory
                                    : txn.category,
                        }))}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showNote={false}
                    ></TransactionList>

                    {/* Budgets */}
                    <BudgetSummary
                        dateRange={dateRange}
                        confirmDelete={confirmDelete}
                        confirmEdit={open}
                    />

                    <ConfirmationDialog
                        open={confirmDelete}
                        setOpen={setConfirmDelete}
                        onConfirm={confirmDeleteEntry}
                        actionType="delete"
                        entry={{
                            category: selectedDelete?.category,
                            customCategory: selectedDelete?.customCategory,
                            note: selectedDelete?.note,
                            amount: selectedDelete?.amount,
                        }}
                    />
                </div>
            </div>

            {/* Edit / Add Transaction Form Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <TransactionForm
                        type={type}
                        setOpen={handleFormClose}
                        editingId={editingId}
                        editingData={editingData}
                        triggerRefresh={refreshTrigger}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export {
    fetchExpenses,
    fetchFilteredTransactions,
    fetchIncomes,
    mergeAndSortTransactions,
    useTransactionTotals,
};
