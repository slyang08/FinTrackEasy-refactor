// src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

import api from "@/api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            window.location.href = "/register";
        } catch (err) {
            setError("Invalid email or password." + err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    {/* Email */}
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    {/* Password */}
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="flex flex-col justify-between mt-4 text-sm">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                    <p>Don&#39;t have an account?</p>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register now
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
