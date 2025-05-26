// src/App.jsx
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom.js";
import Footer from "@/components/Footer.jsx";
import Navbar from "@/components/Navbar.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import ChangePassword from "@/pages/ChangePassword.jsx";
import ContactUs from "@/pages/ContactUs.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import Home from "@/pages/Home.jsx";
import Login from "@/pages/Login.jsx";
import OAuthCallback from "@/pages/OAuthCallback.jsx";
import Profile from "@/pages/Profile.jsx";
import Register from "@/pages/Register.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import Terms from "@/pages/Terms.jsx";
import VerifyEmail from "@/pages/VerifyEmail.jsx";

const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
    const [, setIsAuth] = useAtom(isAuthenticated);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            // 1. Check if localStorage has a token
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuth(false);
                setVerifying(false);
                return;
            }

            // 2. Set axios default header
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                // 3. Verify that the token is valid
                await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
                setIsAuth(true);
            } catch (err) {
                // 4. Verification failed, remove token
                setIsAuth(false);
                localStorage.removeItem("token");
                console.error(err);
            } finally {
                // 5. Verification completed, close loading state
                setVerifying(false);
            }
        };

        verifyAuth();
    }, [setIsAuth]);

    if (verifying) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-grow">
                <Routes>
                    {/* Root directory should set it to home page in the future */}
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/changepassword"
                        element={
                            <ProtectedRoute>
                                <ChangePassword />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
