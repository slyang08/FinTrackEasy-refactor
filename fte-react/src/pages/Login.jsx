// src/pages/Login.jsx
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

import { isAuthenticated } from "../atoms/Atom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isAuth, setIsAuth] = useAtom(isAuthenticated);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            // Assume the backend returns { token: '...' }
            localStorage.setItem("token", res.data.token);

            // Set axios default header
            api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

            setIsAuth(true);

            navigate("/profile");
        } catch (err) {
            // setError("Invalid email or password." + err);
            setError("Invalid email or password.");
        }
    };

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    };

    return (
        <div className="flex justify-center min-h-[calc(100vh-2.5rem)] items-center">
            <div className="space-y-4 w-md shadow-2xl p-10 rounded-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-4xl font-bold text-center text-green-600">Sign In</h2>
                    <div>
                        {/* Email */}
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-200 w-full px-4 py-2 rounded-md"
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
                            className="bg-gray-200 w-full px-4 py-2 rounded-md"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className="min-h-5">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <div>
                        <Link to="/forgotpassword" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-800"
                    >
                        Sign In
                    </button>
                    <div>
                        <p className="text-gray-500">Don&#39;t have an account?</p>
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register now
                        </Link>
                    </div>
                </form>
                <hr className="text-gray-300" />
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    // className="w-full bg-white border border-gray-300 text-white py-2 rounded flex items-center justify-center gap-2 mb-4 hover:bg-gray-100"
                    className="w-full text-gray-500 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex justify-center items-center"
                >
                    <FontAwesomeIcon icon={faGoogle} className="mr-4 border p-1 rounded-xl" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
