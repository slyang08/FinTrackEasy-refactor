import "./App.css";

import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import api from "@/api/axios";

import ChangePassword from "./pages/ChangePassword.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Login from "./pages/Login.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Terms from "./pages/Terms.jsx";

const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
    useEffect(() => {
        // Check localStorage for token every time the App is loaded
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, []);

    return (
        <Router>
            <div>
                <h1 className="text-4xl font-bold text-blue-500">FinTrackEasy</h1>
                <Routes>
                    {/* Root directory should set it to home page in the future */}
                    <Route path="/" element={<Login />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/changepassword" element={<ChangePassword />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
