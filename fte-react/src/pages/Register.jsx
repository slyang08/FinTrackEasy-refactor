// src/pages/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function Register() {
    const [formData, setFormData] = useState({
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        agreeTerms: false,
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nickname, email, password, confirmPassword, phone } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                nickname,
                email,
                password,
                confirmPassword,
                phone,
            });

            navigate("/login");
        } catch (err) {
            setError("An error occurred while registering. Please try again." + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register Form</h2>

                <div className="flex flex-col space-y-4">
                    {/* Nickname */}
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="Nickname"
                        className="px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Phone */}
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Terms Agreement */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="h-4 w-4"
                            required
                        />
                        <label>
                            Agree with our&nbsp;
                            <Link to="/terms" className="text-blue-500">
                                Terms
                            </Link>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && <div className="text-red-500 text-center">{error}</div>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-blue-500 text-white rounded-md ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </div>

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
