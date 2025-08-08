import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/api/axios";
import CategoryFilter from "@/components/CategoryFilter";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import TransactionForm from "@/components/Form";
import TransactionDateFilter from "@/components/TransactionDateFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import SummarySection from "../components/SummarySection";
import TransactionList from "../components/TransactionList";

// Category lists
const allIncome = [
    "Gift",
    "Salary",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Business",
    "Insurance Payout",
    "Other",
];

const allExpense = [
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

    if (incomeCategories.length > 0) {
        incomeParams.categories = incomeCategories.join(",");
    }
    if (expenseCategories.length > 0) {
        expenseParams.categories = expenseCategories.join(",");
    }

    let incomes = [];
    let expenses = [];

    if (
        selectedCategories.length === 0 ||
        (incomeCategories.length > 0 && expenseCategories.length > 0)
    ) {
        [incomes, expenses] = await Promise.all([
            fetchIncomes(incomeParams),
            fetchExpenses(expenseParams),
        ]);
    } else if (incomeCategories.length > 0) {
        incomes = await fetchIncomes(incomeParams);
    } else if (expenseCategories.length > 0) {
        expenses = await fetchExpenses(expenseParams);
    }

    return mergeAndSortTransactions(incomes, expenses);
}

export default function Transactions() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
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
            const endpoint = selectedDelete.type === "income" ? "incomes" : "expenses";
            await api.delete(`/${endpoint}/${selectedDelete._id}`);
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

    return (
        <div className="flex flex-col min-h-screen">
        {/* Main content */}
        <main className="flex-1 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
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
                            className="cursor-pointer w-30"
                        >
                            Add Expense
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <TransactionDateFilter dateRange={dateRange} onChange={setDateRange} />
                    </div>
                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        dateRange={dateRange}
                        onChange={setSelectedCategories}
                    />
                </div>

                {/* Summary Cards */}
                <SummarySection balance={balance} income={totalIncome} expenses={totalExpenses} />

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
                    showNote={true}
                    className="max-h-none"
                />

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    open={confirmDelete}
                    setOpen={setConfirmDelete}
                    onConfirm={confirmDeleteEntry}
                    actionType="delete"
                    entry={{
                        name: selectedDelete?.category,
                        note: selectedDelete?.note,
                        amount: selectedDelete?.amount,
                    }}
                />
            </div>

            {/* Edit / Add Transaction Form Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <TransactionForm
                        type={type}
                        setOpen={handleFormClose}
                        editingId={editingId}
                        editingData={editingData}
                    />
                </DialogContent>
            </Dialog>
        </main>
        </div>
    );
}
