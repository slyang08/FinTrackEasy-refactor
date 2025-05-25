// src/components/ProtectedRoute.jsx
import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "@/atoms/Atom.js";

export default function ProtectedRoute({ children }) {
    const [isAuth] = useAtom(isAuthenticated);

    return isAuth ? children : <Navigate to="/login" replace />;
}
