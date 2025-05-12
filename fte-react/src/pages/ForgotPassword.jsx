// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

import api from "@/api/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotFound(false);

        try {
            await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgotpassword`, { email });
        } catch (err) {
            if (err.response?.status === 404) {
                setNotFound(true);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-green-900 h-14 flex items-center justify-between px-6">
                <div className="flex items-center space-x-2 text-white font-bold text-lg">
                    <span className="text-2xl">🖐</span>
                    <span>FinTrackEasy</span>
                </div>
                <div className="text-white text-2xl">👤</div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center items-center">
                <div className="border border-green-100 shadow-md p-10 rounded bg-white text-center w-96">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                        Trouble logging in?
                    </h2>
                    <p className="text-sm text-gray-700 mb-6">
                        {notFound
                            ? "Account with the provided email doesn't exist. You may try another email"
                            : "Enter your email and we will send you a link to get back into your account"}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded text-black bg-gray-200 placeholder-gray-600"
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Request"}
                        </button>
                    </form>
                    <hr className="my-6 border-gray-300" />
                    <Link to="/login" className="text-blue-600 text-sm hover:underline">
                        Sign in
                    </Link>
                </div>
            </main>
        </div>
    );
}
