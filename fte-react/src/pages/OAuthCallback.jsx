// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Try to obtain user information and confirm that the session has been established
        api.get("/auth/me")
            .then(() => {
                // You can set global user status here
                navigate("/profile");
            })
            .catch(() => {
                // If failed, jump back to the login page
                navigate("/login");
            });
    }, [navigate]);

    return <div>Logging you in...</div>;
}
