// src/App.jsx
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom.js";
import Footer from "@/components/Footer.jsx";
import Navbar from "@/components/Navbar.jsx";

import { appRoutes } from "./routes/appRoutes.jsx";

function App() {
    const [, setIsAuth] = useAtom(isAuthenticated);
    const [verifying, setVerifying] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            if (location.pathname === "/oauth-callback") {
                setVerifying(false);
                return;
            }

            try {
                await api.get("/auth/me");
                setIsAuth(true);
            } catch (err) {
                setIsAuth(false);
                console.error(err);
            } finally {
                setVerifying(false);
            }
        };

        verifyAuth();
    }, [setIsAuth, location]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            {verifying ? (
                <div className="min-h-screen flex items-center justify-center">
                    Is jumping to the page...
                </div>
            ) : (
                <div className="min-h-screen">
                    <Routes>
                        {appRoutes.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </Routes>
                </div>
            )}
            <Footer />
            <Toaster richColors position="top-right" />
        </div>
    );
}

export default App;
