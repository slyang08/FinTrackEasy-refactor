// src/components/PublicRoute.jsx
import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "@/atoms/Atom";

export default function PublicRoute({ children }) {
    const [isAuth] = useAtom(isAuthenticated);
    return isAuth ? <Navigate to="/profile" replace /> : children;
}
