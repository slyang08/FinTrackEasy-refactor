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
// TO DO: Install Hook for fetching income/expense by filter
//import useTransactions from "../hooks/useTransactions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import TransactionForm from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import CategoryFilter from "../components/CategoryFilter";
import SummarySection from "../components/SummarySection";
import TransactionDateFilter from "../components/TransactionDateFilter";
import TransactionList from "../components/TransactionList";

export default function Transactions() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Default date range to today
    const today = new Date();
    const [dateRange, setDateRange] = useState({
        from: today,
        to: today,
    });

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

    const fetchTransactions = async () => {
        try {
            const [incomeRes, expenseRes] = await Promise.all([
                api.get("/incomes"),
                api.get("/expenses"),
            ]);
            const incomes = incomeRes.data.map((txn) => ({ ...txn, type: "income" }));
            const expenses = expenseRes.data.map((txn) => ({ ...txn, type: "expense" }));
            setTransactions(
                [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
            );
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Calculate totals (filtering by type)
    const totalIncome = transactions
        .filter((txn) => txn.type === "income")
        // Uncomment when date filtering is fixed
        //.filter((txn) => new Date(txn.date) >= dateRange.from && new Date(txn.date) <= dateRange.to)
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

    const totalExpenses = transactions
        .filter((txn) => txn.type === "expense")
        // Uncomment when date filtering is fixed
        //.filter((txn) => new Date(txn.date) >= dateRange.from && new Date(txn.date) <= dateRange.to)
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

    const balance = totalIncome - totalExpenses;

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
            fetchTransactions();
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
        fetchTransactions();
    };

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        <Button variant="income" onClick={() => openDialog("income")}>
                            Add Income
                        </Button>
                        <Button variant="expense" onClick={() => openDialog("expense")}>
                            Add Expense
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <TransactionDateFilter dateRange={dateRange} onChange={setDateRange} />
                    </div>
                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                </div>

                {/* Summary Cards */}
                <SummarySection balance={balance} income={totalIncome} expenses={totalExpenses} />

                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showNote={false}
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
        </div>
    );
}
