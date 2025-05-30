// src/pages/ChangePassword.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedAccountId, setSelectedAccountId] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Get all accounts of user
    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                if (res.data.accounts && res.data.accounts.length > 0) {
                    setSelectedAccountId(res.data.accounts[0]._id); // Select the first account by default
                } else {
                    setMessage("No account found for this user.");
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
            await api.patch(`/auth/${selectedAccountId}/changepassword`, {
                currentPassword,
                newPassword,
                confirmPassword,
            });
            setMessage("Password changed successfully!");
            navigate("/profile");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to change password"
            );
        }
    };

    return (
        <div className="min-h-[calc(100vh-2.5rem)] flex flex-col">
            <main className="flex-grow flex justify-center items-center">
                <div className="shadow-2xl p-10 rounded-xl">
                    <h2 className="text-3xl font-bold mb-6 text-green-600 text-center">
                        Change Password
                    </h2>
                    {message && (
                        <div
                            className={`mb-4 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 w-xs">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-200"
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-200"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-200"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-800"
                        >
                            Change password
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
