import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuth, setIsAuth] = useAtom(isAuthenticated);
    const navigate = useNavigate();

    function navItemClicked() {
        setIsOpen(false);
    }

    async function handleLogout() {
        try {
            await api.get("/auth/logout");
            setIsAuth(false);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <nav className="flex items-center justify-between bg-green-800 px-4 h-12 w-full">
            {/* Left: Logo */}
            <div className="flex items-center w-1/3">
                <Link to="/" className="font-bold text-white text-2xl">
                    FinTrackEasy
                </Link>
            </div>

            {/* Center: Authenticated-only Links */}
            {isAuth && (
                <div className="flex justify-center gap-x-10 flex-1">
                    <Link to="/overview" className="text-white hover:text-gray-300">
                        Overview
                    </Link>
                    <Link to="/transactions" className="text-white hover:text-gray-300">
                        Transactions
                    </Link>
                    <Link to="/budgets" className="text-white hover:text-gray-300">
                        Budgets
                    </Link>
                </div>
            )}

            {/* Right: Guest Links or User Icon */}
            {!isAuth ? (
                <div className="hidden md:flex justify-end items-center gap-x-6 text-white">
                    <Link to="/">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/login" className="hover:underline">
                        Log In
                    </Link>
                    <Link to="/signup" className="hover:underline">
                        Sign Up
                    </Link>
                </div>
            ) : (
                <div
                    className="flex justify-end items-center w-1/3 relative group"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <FontAwesomeIcon
                        icon={faCircleUser}
                        className="text-white text-2xl cursor-pointer"
                    />
                    <div
                        className={`absolute top-full right-0 mt-1 bg-white rounded-md shadow-xl ${
                            isOpen ? "visible" : "invisible"
                        } duration-200 z-10 min-w-[160px]`}
                    >
                        <ul className="p-2">
                            <li>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-gray-300 p-3"
                                    onClick={navItemClicked}
                                >
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/expense"
                                    className="text-gray-700 hover:text-gray-300 p-3"
                                    onClick={navItemClicked}
                                >
                                    Expense (Deprecated)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/income"
                                    className="text-gray-700 hover:text-gray-300 p-3"
                                    onClick={navItemClicked}
                                >
                                    Income (Deprecated)
                                </Link>
                            </li>
                            <li>
                                <a
                                    className="text-gray-700 cursor-pointer hover:text-gray-300 p-3"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
}
