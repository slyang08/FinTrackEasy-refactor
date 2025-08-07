// src/pages/OAuthCallback.jsx
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom";

export default function OAuthCallback() {
    const [, setIsAuth] = useAtom(isAuthenticated);
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
                return api.get("/auth/me");
            })
            .then(() => {
                // 4. Get the user to store and navigate to the global state.
                setIsAuth(true);
                navigate("/overview");
            })
            .catch(() => {
                // Failback login
                navigate("/login");
            });
    }, [navigate, setIsAuth]);

    return <div>Logging you in...</div>;
}
