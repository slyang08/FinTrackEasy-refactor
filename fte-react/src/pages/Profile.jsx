// src/pages/Profile.jsx
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { getUserInfo } from "@/api/user";

import { isAuthenticated } from "../atoms/Atom";

export default function Profile() {
    const [profile, setProfile] = useState({
        nickname: "",
        email: "",
        phone: "",
        preferredLanguage: "English",
        _id: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [, setIsAuth] = useAtom(isAuthenticated);

    const navigate = useNavigate();

    // Loading personal info
    useEffect(() => {
        getUserInfo()
            .then((user) => {
                setProfile(user);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err?.response?.data?.message || err.message);
                setMessage("Failed to load profile: ");
                setLoading(false);
            });
    }, []);

    // Handle profile changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
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
                    nickname: profile.nickname,
                    phone: profile.phone,
                    preferredLanguage: profile.preferredLanguage,
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
        setIsAuth(false);
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="m-15">
            <h1 className="text-green-600 font-bold text-3xl">Profile</h1>

            <div
                className={`h-10 mb-4 p-2 rounded ${message == "" ? "invisible" : "visible"} ${
                    message.includes("success")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {message}
            </div>

            <div className="grid grid-cols-2 max-w-1/2 space-y-5 mt-10">
                <p>Email:</p>
                <p>{profile.email}</p>

                <p>Password:</p>
                <Link to={"/changepassword"} className="text-blue-600 hover:underline">
                    Change Password
                </Link>

                <p className="flex items-center">Nickname:</p>
                <input
                    name="nickname"
                    value={profile.nickname}
                    onChange={handleChange}
                    className="bg-gray-200 rounded-md py-1 px-3"
                />

                <p className="flex items-center">Phone:</p>
                <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="bg-gray-200 rounded-md py-1 px-3"
                />

                <p>Language:</p>
                <select
                    name="preferredLanguage"
                    onChange={handleChange}
                    className="bg-gray-200 rounded-md py-1 px-3"
                >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>

                <button
                    onClick={handleSave}
                    className="bg-green-700 hover:bg-green-800 rounded-xl col-start-2 text-white p-2"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
            <div className="space-y-5 mt-5">
                <p>
                    Contact us:{" "}
                    <a
                        href="mailto:fintrackeasy@gmail.com"
                        className="text-blue-600 hover:underline"
                    >
                        fintrackeasy@gmail.com
                    </a>
                </p>

                <Link to={"/terms"} className="text-blue-600 hover:underline block">
                    Terms and conditions
                </Link>

                <button className="text-blue-600 hover:underline" onClick={handleLogout}>
                    Sign out
                </button>
            </div>
        </div>
    );
}
