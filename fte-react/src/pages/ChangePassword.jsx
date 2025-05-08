// src/pages/ChangePassword.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Get all accounts of user
    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                console.log("res.data from /users/me:", res.data);
                setAccounts(res.data.accounts || []);
                if (res.data.accounts && res.data.accounts.length > 0) {
                    setSelectedAccountId(res.data.accounts[0]._id); // Select the first account by default
                }
            })
            .catch(() => setMessage("Failed to get account info"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match!");
            return;
        }
        try {
            await api.patch(
                `${import.meta.env.VITE_API_BASE_URL}/accounts/${selectedAccountId}/changepassword`,
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }
            );
            setMessage("Password changed successfully!");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to change password"
            );
        }
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-green-900 h-12 w-full" />
            <main className="flex-grow flex justify-center items-center">
                <div className="border border-green-100 shadow-md p-10 rounded bg-white">
                    <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
                        Change Password
                    </h2>
                    {message && (
                        <div
                            className={`mb-4 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 w-72">
                        {/* Account selection */}
                        {accounts.length > 1 && (
                            <select
                                className="w-full px-4 py-2 rounded bg-gray-200"
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                            >
                                {accounts.map((acc) => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.nickname || acc._id}
                                    </option>
                                ))}
                            </select>
                        )}
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-black placeholder-gray-600"
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-black placeholder-gray-600"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-black placeholder-gray-600"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800 transition"
                        >
                            Change password
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
