// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Get the accountId and token on the URL
    const params = new URLSearchParams(window.location.search);
    const accountId = params.get("accountId");
    const token = params.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        try {
            await api.patch(
                `${import.meta.env.VITE_API_BASE_URL}/auth/${accountId}/resetpassword`,
                {
                    token,
                    newPassword,
                    confirmPassword,
                }
            );
            setMessage("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to reset password"
            );
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-green-900 h-12 w-full" />
            <main className="flex-grow flex justify-center items-center">
                <div className="border border-green-100 shadow-md p-10 rounded bg-white">
                    <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
                        Reset Password
                    </h2>
                    {message && (
                        <div
                            className={`mb-4 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 w-72">
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-black placeholder-gray-600"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-black placeholder-gray-600"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800 transition"
                        >
                            Reset password
                        </button>
                    </form>
                    {message && <div>{message}</div>}
                </div>
            </main>
        </div>
    );
}
