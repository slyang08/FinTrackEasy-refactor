// src/pages/OAuthCallback.jsx
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom";

export default function OAuthCallback() {
    const [, setIsAuth] = useAtom(isAuthenticated);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // 1. Failure to return to login without a token.
        if (!token) {
            navigate("/login");
            return;
        }

        // 2. POST first to write a cookie to the backend.
        const authenticate = async (retries = 10) => {
            try {
                // 3. POST first to write a cookie to the backend.
                await api.post("/auth/set-cookie", { token });
                // 4. Successfully set cookie, authenticate immediately
                await api.get("/auth/me");
                // 5. Get the user to store and navigate to the global state.
                setIsAuth(true);
                navigate("/overview");
            } catch (error) {
                if (retries > 0) {
                    // 6. If failed, try again
                    setTimeout(() => authenticate(retries - 1), 3000);
                } else {
                    // 7. Reach the maximum number of retries and jump to the login page
                    console.error("Authentication failed:", error);
                    navigate("/login");
                }
            } finally {
                setLoading(false); // Update the loading status after the request is completed
            }
        };

        authenticate(); // Start the authentication process
    }, [navigate, setIsAuth]);

    return loading ? <div>Logging you in...</div> : null; // Display content according to loading status
}
