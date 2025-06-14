"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

import api from "@/api/axios";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import TransactionForm from "../components/Form";

export default function Test2() {
    const [transactions, setTransactions] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [formType, setFormType] = useState("expense"); // track which type form is for
    const [editingData, setEditingData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);

    const fetchData = async () => {
        try {
            const [incomesRes, expensesRes] = await Promise.all([
                api.get("/incomes"),
                api.get("/expenses"),
            ]);

            const incomes = (incomesRes.data || []).map((item) => ({
                ...item,
                type: "income",
            }));
            const expenses = (expensesRes.data || []).map((item) => ({
                ...item,
                type: "expense",
            }));

            const combined = [...incomes, ...expenses].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setTransactions(combined);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (entry) => {
        setEditingData(entry);
        setEditingId(entry._id);
        setFormType(entry.type); // set form type based on what is edited
        setOpenForm(true);
    };

    const handleDelete = (entry) => {
        setSelectedDelete(entry);
        setConfirmDelete(true);
    };

    const confirmDeleteEntry = async () => {
        try {
            const endpoint = selectedDelete.type === "income" ? "incomes" : "expenses";
            await api.delete(`/${endpoint}/${selectedDelete._id}`);
            setConfirmDelete(false);
            setSelectedDelete(null);
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleAdd = (type) => {
        setFormType(type);
        setEditingData(null);
        setEditingId(null);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setEditingId(null);
        setEditingData(null);
        fetchData();
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-end mb-4 space-x-2">
                <Button
                    onClick={() => handleAdd("income")}
                    variant="outline"
                    className="text-green-600"
                >
                    Add Income
                </Button>
                <Button
                    onClick={() => handleAdd("expense")}
                    variant="outline"
                    className="text-red-600"
                >
                    Add Expense
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((txn) => {
                        const isIncome = txn.type === "income";
                        return (
                            <TableRow key={txn._id}>
                                <TableCell>{format(new Date(txn.date), "PPP")}</TableCell>
                                <TableCell>{txn.category}</TableCell>
                                <TableCell>{txn.note || "—"}</TableCell>
                                <TableCell
                                    className={`font-semibold ${
                                        isIncome ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {isIncome ? "+" : "-"}${txn.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
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
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Form Modal */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="max-w-2xl">
                    <TransactionForm
                        type={formType} // pass correct type to form
                        setOpen={handleFormClose}
                        editingId={editingId}
                        editingData={editingData}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
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
    );
}
