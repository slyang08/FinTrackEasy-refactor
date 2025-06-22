// src/pages/Income.jsx
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect, useState } from "react";

import api from "@/api/axios.js";
dayjs.extend(advancedFormat);

export default function Income() {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        amount: "",
        category: "",
        description: "",
        isRecurring: false,
    });

    const [incomes, setIncomes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [, setLoading] = useState(false);
    const [, setError] = useState(null);

    // Read the income list
    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/incomes");
            setIncomes(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load incomes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
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

    // Add or update income
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Update
                await api.patch(`/incomes/${editingId}`, {
                    name: formData.name,
                    date: formData.date || undefined,
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    isRecurring: formData.isRecurring,
                });
                alert("Income updated!");
            } else {
                // Create
                await api.post("/incomes", {
                    name: formData.name,
                    date: formData.date || undefined,
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    isRecurring: formData.isRecurring,
                });
                alert("Income added!");
            }

            handleClear();
            fetchIncomes();
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
            }
            alert("Failed to save income");
            console.error(err);
        }
    };

    // Click to edit
    const handleEdit = (income) => {
        setFormData({
            name: income.name,
            date: income.date ? new Date(income.date).toISOString().slice(0, 10) : "",
            amount: income.amount,
            category: income.category,
            description: income.description,
            isRecurring: income.isRecurring,
        });
        setEditingId(income._id);
    };

    // Delete income
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;

        try {
            await api.delete(`/incomes/${id}`);
            alert("Income deleted");
            fetchIncomes();
        } catch (err) {
            alert("Failed to delete income");
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
                        {editingId ? "Edit income" : "Add income"}
                    </h2>

                    <div className="flex flex-col md:flex-row space-x-4">
                        <div>
                            <label htmlFor="name">Income name *</label>
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
                        <label htmlFor="category">Income Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="px-4 py-2 bg-gray-200 rounded w-full"
                        >
                            <option value="">Select</option>
                            <option value="Pay">Pay</option>
                            <option value="Gift">Gift</option>
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
                        Recurring income
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
                            {editingId ? "Update Income" : "Add Income"}
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
                        <h3 className="text-2xl font-bold mb-2">Income Overview</h3>
                        <button className="text-2xl cursor-pointer">🎛️</button>
                    </div>
                    <div className="flex space-x-4 text-sm mb-4">
                        <span className="text-blue-500">■ Gifts</span>
                        <span className="text-green-600">■ Pay</span>
                        <span className="text-lime-500">■ Other</span>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-500">
                        (Chart Here)
                    </div>

                    {incomes.map((income) => (
                        <>
                            <p className="font-semibold">{dayjs(income.date).format("MMMM Do")}</p>
                            <ul className="my-2 text-sm">
                                {income.length === 0 && <li>No income records found.</li>}
                                <li key={income._id} className="flex justify-between">
                                    <span>
                                        {income.name} {income.isRecurring ? " (recurring)" : ""}
                                    </span>
                                    <span className="flex items-center space-x-4">
                                        <span className="font-mono">
                                            ${income.amount.toFixed(2)}
                                        </span>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2 opacity-80 group-hover:opacity-100">
                                            <button
                                                className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                                                onClick={() => handleEdit(income)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                                                onClick={() => handleDelete(income._id)}
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
