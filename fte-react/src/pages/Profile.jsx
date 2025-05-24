// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { getUserInfo } from "@/api/user";

export default function Profile() {
    const [profile, setProfile] = useState({
        nickname: "",
        email: "",
        phone: "",
        preferredLanguage: "English",
        _id: "",
    });

    // Form input
    const [form, setForm] = useState({
        nickname: "",
        phone: "",
        preferredLanguage: "English",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Loading personal info
    useEffect(() => {
        getUserInfo()
            .then((user) => {
                setProfile(user);
                setForm({
                    nickname: user.nickname || "",
                    phone: user.phone || "",
                    preferredLanguage: user.preferredLanguage || "English",
                });
                setLoading(false);
            })
            .catch((err) => {
                setMessage(
                    "Failed to load profile: " + (err?.response?.data?.message || err.message)
                );
                setLoading(false);
            });
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save changes
    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            await api.patch(
                `${import.meta.env.VITE_API_BASE_URL}/users/${profile._id}`,
                {
                    nickname: form.nickname,
                    phone: form.phone,
                    preferredLanguage: form.preferredLanguage,
                },
                { withCredentials: true }
            );
            setMessage("Profile updated successfully!");
            // Re-obtain the latest data
            const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
            setProfile(res.data.user);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to update profile"
            );
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        try {
            await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`);
        } catch (err) {
            setMessage(err);
        }
        // Clear all JWT tokens
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        navigate("/login");
    };

    // Jump to the password change page
    const handleChangePassword = (e) => {
        e.preventDefault();
        navigate("/changepassword");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <main className="max-w-xl mx-auto py-10 px-6">
                <h2 className="text-2xl font-semibold text-green-700 mb-6">Profile</h2>

                {message && (
                    <div
                        className={`mb-4 p-2 rounded ${
                            message.includes("success")
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Email:</label>
                        <p className="text-gray-700">{profile.email}</p>
                    </div>

                    <div>
                        <label className="block font-medium">Password:</label>
                        <div className="flex items-center justify-between">
                            <p className="text-black">●●●●●●●●</p>
                            <a
                                href="#"
                                className="text-sm text-black underline"
                                onClick={handleChangePassword}
                            >
                                Change password
                            </a>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Nickname:</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-100"
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Phone:</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-100"
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Language:</label>
                        <select
                            className="w-full px-4 py-2 rounded bg-gray-100"
                            name="preferredLanguage"
                            value={form.preferredLanguage}
                            onChange={handleChange}
                        >
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <button
                        className="bg-green-700 text-white px-6 py-2 rounded mt-4 hover:bg-green-800 transition"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>

                <div className="mt-10 space-y-3 text-sm">
                    <p>
                        Contact us:{" "}
                        <a href="mailto:fintrackeasy@gmail.com" className="text-blue-600 underline">
                            fintrackeasy@gmail.com
                        </a>
                    </p>
                    <p>
                        <a href="#" className="underline">
                            Go to Privacy terms and conditions
                        </a>
                    </p>
                    <p>
                        <button onClick={handleLogout} className="underline text-red-600">
                            Sign out
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
}
