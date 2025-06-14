import { useState } from "react";
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

import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

import CategoryFilter from "../components/CategoryFilter";

export default function Overview() {
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

    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);

    const openDialog = (entryType) => {
        setType(entryType);
        setOpen(true);
    };

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="income"
                            className="flex-1"
                            onClick={() => openDialog("income")}
                        >
                            Add Income
                        </Button>
                        <Button
                            variant="expense"
                            className="flex-1"
                            onClick={() => openDialog("expense")}
                        >
                            Add Expense
                        </Button>

                        <FormDialog open={open} setOpen={setOpen} type={type} />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="border border-black px-3 py-2 rounded">❮</button>
                        <span className="px-4 py-2 border border-black rounded-xl font-medium">
                            Jun 01, 2025 – Jun 30, 2025
                        </span>
                        <button className="border border-black px-3 py-2 rounded">❯</button>
                    </div>

                    <div className="flex items-center">
                        <CategoryFilter className="w-full"></CategoryFilter>
                    </div>
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
                        <div>
                            <p className="text-sm font-semibold">June 02, 2025</p>
                            <div className="text-sm">+500.00 CAD</div>
                            <ul className="text-sm space-y-1">
                                <li className="flex justify-between">
                                    <span>Extra Income</span>
                                    <span className="text-green-600">+100.00 CAD</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Salary</span>
                                    <span className="text-green-600">+500.00 CAD</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Food & Drink</span>
                                    <span className="text-red-600">-100.00 CAD</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">June 01, 2025</p>
                            <div className="text-sm">+500.00 CAD</div>
                            <ul className="text-sm space-y-1">
                                <li className="flex justify-between">
                                    <span>Salary</span>
                                    <span className="text-green-600">+500.00 CAD</span>
                                </li>
                            </ul>
                        </div>
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
                </div>
            </div>
        </div>
    );
}
