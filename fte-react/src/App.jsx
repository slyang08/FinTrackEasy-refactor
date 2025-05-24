import "./App.css";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import api from "@/api/axios";

import { isAuthenticated } from "./atoms/Atom.js";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Terms from "./pages/Terms.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
    const [isAuth, setIsAuth] = useAtom(isAuthenticated);

    useEffect(() => {
        // Check localStorage for token every time the App is loaded
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    return (
        <>
            <Navbar />
            <div>
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
        </>
    );
}

export default App;
