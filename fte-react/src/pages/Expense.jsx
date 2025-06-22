// src/pages/Expense.jsx
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect, useState } from "react";

import api from "@/api/axios.js";
dayjs.extend(advancedFormat);

export default function Expense() {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        amount: "",
        category: "",
        description: "",
        isRecurring: false,
    });

    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [, setLoading] = useState(false);
    const [, setError] = useState(null);

    // Read the expense list
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await api.get("/expenses");
            setExpenses(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load expenses");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleClear = () => {
        setFormData({
            name: "",
            date: "",
            amount: "",
            category: "",
            description: "",
            isRecurring: false,
        });
        setEditingId(null);
    };

    // Add or update expense
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Update
                await api.patch(`/expenses/${editingId}`, {
                    name: formData.name,
                    date: formData.date || undefined,
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    isRecurring: formData.isRecurring,
                });
                alert("expense updated!");
            } else {
                // Create
                await api.post("/expenses", {
                    name: formData.name,
                    date: formData.date || undefined,
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    isRecurring: formData.isRecurring,
                });
                alert("expense added!");
            }

            handleClear();
            fetchExpenses();
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
            }
            alert("Failed to save expense");
            console.error(err);
        }
    };

    // Click to edit
    const handleEdit = (expense) => {
        setFormData({
            name: expense.name,
            date: expense.date ? new Date(expense.date).toISOString().slice(0, 10) : "",
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            isRecurring: expense.isRecurring,
        });
        setEditingId(expense._id);
    };

    // Delete expense
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        try {
            await api.delete(`/expenses/${id}`);
            alert("expense deleted");
            fetchExpenses();
        } catch (err) {
            alert("Failed to delete expense");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Main */}
            <main className="flex flex-1">
                {/* Left Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-1/2 bg-gray-50 p-8 flex flex-col space-y-4"
                >
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        {editingId ? "Edit expense" : "Add expense"}
                    </h2>

                    <div className="flex flex-col md:flex-row space-x-4">
                        <div>
                            <label htmlFor="name">Expense name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. dogwalking"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                className="flex-1 px-4 py-2 bg-gray-200 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="date">Transaction Date *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 bg-gray-200 rounded"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="amount">Amount *</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            placeholder="$ 0.0"
                            value={formData.amount}
                            onChange={handleChange}
                            className="px-4 py-2 bg-gray-200 rounded w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="category">Expense Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="px-4 py-2 bg-gray-200 rounded w-full"
                        >
                            <option value="">Select</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Gas">Gas</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="Rent">Rent</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter a brief description..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="px-4 py-2 bg-gray-200 rounded w-full resize-none"
                        />
                    </div>

                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="isRecurring"
                            checked={formData.isRecurring}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Recurring expense
                    </label>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-red-800 text-white px-4 py-2 rounded"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            {editingId ? "Update Expense" : "Add Expense"}
                        </button>
                    </div>
                </form>

                {/* Right Report Section */}
                <section className="w-1/2 p-8">
                    <div className="flex justify-between items-center mb-4">
                        <button className="bg-green-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-green-600">
                            Generate Report
                        </button>
                    </div>

                    <div className="flex flex-row space-x-8">
                        <h3 className="text-2xl font-bold mb-2">Expense Overview</h3>
                        <button className="text-2xl cursor-pointer">🎛️</button>
                    </div>
                    <div className="flex space-x-4 text-sm mb-4">
                        <span className="text-blue-500">■ Grocery</span>
                        <span className="text-green-600">■ Entertainment</span>
                        <span className="text-lime-500">■ Bills</span>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-500">
                        (Chart Here)
                    </div>

                    {expenses.map((expense) => (
                        <>
                            <p className="font-semibold">{dayjs(expense.date).format("MMMM Do")}</p>
                            <ul className="my-2 text-sm">
                                {expense.length === 0 && <li>No expense records found.</li>}
                                <li key={expense._id} className="flex justify-between">
                                    <span>
                                        {expense.name} {expense.isRecurring ? " (recurring)" : ""}
                                    </span>
                                    <span className="flex items-center space-x-4">
                                        <span className="font-mono">
                                            ${expense.amount.toFixed(2)}
                                        </span>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2 opacity-80 group-hover:opacity-100">
                                            <button
                                                className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                                                onClick={() => handleEdit(expense)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                                                onClick={() => handleDelete(expense._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </>
                    ))}
                </section>
            </main>
        </div>
    );
}
