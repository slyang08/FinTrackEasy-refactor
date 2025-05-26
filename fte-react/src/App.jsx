// src/App.jsx
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import api from "@/api/axios";
import { isAuthenticated } from "@/atoms/Atom.js";
import Footer from "@/components/Footer.jsx";
import Navbar from "@/components/Navbar.jsx";

import { appRoutes } from "./routes/appRoutes.jsx";

function App() {
    const [, setIsAuth] = useAtom(isAuthenticated);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
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
    }, [setIsAuth]);

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
        </div>
    );
}

export default App;
