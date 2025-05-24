import { useAtom } from "jotai";
import { Navigate, replace } from "react-router-dom";

import { isAuthenticated } from "../atoms/Atom";

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useAtom(isAuthenticated);

    return isAuth ? children : <Navigate to="/login" replace />;
}
