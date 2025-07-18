// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // 1. Failure to return to login without a token.
        if (!token) {
            navigate("/login");
            return;
        }

        // 2. POST first to write a cookie to the backend.
        api.post("/auth/set-cookie", { token })
            .then(() => {
                // 3. Successfully set cookie, authenticate immediately (will bring up stateless cookie)
                setTimeout(() => {
                    api.get("/auth/me")
                        .then(() => navigate("/overview"))
                        .catch(() => navigate("/login"));
                }, 2000);
            })
            .then(() => {
                // 4. Get the user to store and navigate to the global state.
                navigate("/overview");
            })
            .catch(() => {
                // Failback login
                navigate("/login");
            });
    }, [navigate]);

    return <div>Logging you in...</div>;
}
