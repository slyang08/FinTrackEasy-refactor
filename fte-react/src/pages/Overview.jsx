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

import api from "@/api/axios";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import TransactionForm from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Overview() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);

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
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleFormClose = () => {
        setOpen(false);
        setEditingData(null);
        setEditingId(null);
        fetchTransactions();
    };

    const incomeData = [
        { date: "Jun 01", salary: 500, other: 100 },
        { date: "Jun 10", salary: 700, other: 200 },
        { date: "Jun 20", salary: 800, other: 150 },
        { date: "Jun 30", salary: 600, other: 250 },
    ];

    const foodDrinkData = [
        { date: "Jun 01", food: 120, drink: 80 },
        { date: "Jun 10", food: 150, drink: 90 },
        { date: "Jun 20", food: 200, drink: 100 },
        { date: "Jun 30", food: 180, drink: 120 },
    ];

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
                        <button className="border border-black px-3 py-2 rounded">❮</button>
                        <span className="px-4 py-2 border border-black rounded-xl font-medium">
                            Jun 01, 2025 – Jun 30, 2025
                        </span>
                        <button className="border border-black px-3 py-2 rounded">❯</button>
                    </div>

                    <button className="border border-black px-4 py-2 rounded-xl">
                        Filter by Categories ▾
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white shadow rounded p-4 border border-black">
                        <p className="text-sm">Current Balance</p>
                        <p className="text-green-600 font-bold">+1,000.00 CAD</p>
                    </div>
                    <div className="bg-white shadow rounded p-4 border border-black">
                        <p className="text-sm">Total Period Expenses</p>
                        <p className="text-red-600 font-bold">-500.00 CAD</p>
                    </div>
                    <div className="bg-white shadow rounded p-4 border border-black">
                        <p className="text-sm">Total Period Income</p>
                        <p className="text-green-600 font-bold">+1,500.00 CAD</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <div className="bg-white shadow rounded p-4 h-64 w-full md:w-[90%]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={incomeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="salary"
                                    stroke="#4ade80"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="other"
                                    stroke="#22d3ee"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow rounded p-4 h-64 w-full md:w-[90%]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={foodDrinkData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="food"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="drink"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions + Budgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white shadow rounded p-4 space-y-4 border border-black">
                        <p className="font-semibold">Recent Transactions</p>

                        {transactions.length === 0 ? (
                            <div className="text-center text-gray-500 italic py-8">
                                No transactions available. Please add income or expenses to get
                                started.
                            </div>
                        ) : (
                            <ul className="text-sm space-y-2">
                                {transactions.map((txn) => (
                                    <li
                                        key={txn._id}
                                        className="flex justify-between items-center border-b pb-1"
                                    >
                                        <div>
                                            <p className="font-medium">{txn.category}</p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(txn.date), "PPP")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={
                                                    txn.type === "income"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {txn.type === "income" ? "+" : "-"}$
                                                {Number(txn.amount).toFixed(2)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-yellow-300 hover:bg-yellow-400 text-black"
                                                onClick={() => handleEdit(txn)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(txn)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white shadow rounded p-4 space-y-4 border border-black">
                        <p className="font-semibold">Monthly Budgets</p>
                        <div className="text-sm space-y-2">
                            <div>
                                <p>Entertainment</p>
                                <div className="flex justify-between text-green-600">
                                    <span>60%</span>
                                    <span>$120.00 / $200.00</span>
                                </div>
                                <p className="text-xs">Remaining amount: $80.00</p>
                            </div>
                            <div>
                                <p>Fuel</p>
                                <div className="flex justify-between text-green-600">
                                    <span>40%</span>
                                    <span>$80.00 / $200.00</span>
                                </div>
                                <p className="text-xs">Remaining amount: $120.00</p>
                            </div>
                        </div>
                    </div>

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
