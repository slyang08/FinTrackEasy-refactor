import "./App.css";

import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import api from "@/api/axios";

import ChangePassword from "./pages/ChangePassword.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
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
                    <Route path="/changepassword" element={<ChangePassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
