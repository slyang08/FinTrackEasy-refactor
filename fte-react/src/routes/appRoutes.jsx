// src/routes/appRoutes.js
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import About from "@/pages/About";
import ChangePassword from "@/pages/ChangePassword";
import ContactUs from "@/pages/ContactUs";
import Expense from "@/pages/Expense";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Income from "@/pages/Income";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OAuthCallback from "@/pages/OAuthCallback";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import Terms from "@/pages/Terms";
import Test from "@/pages/Test";
import Transactions from "@/pages/Transactions";
import VerifyEmail from "@/pages/VerifyEmail";

import Budgets from "../pages/Budgets";
import Goals from "../pages/Goals";
import Overview from "../pages/Overview";
import Test2 from "../pages/Test2";

// Public page (anyone can see it)
export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/contact", element: <ContactUs /> },
    { path: "/test", element: <Test /> },
    { path: "/test2", element: <Test2 /> },
    { path: "/terms", element: <Terms /> },
    { path: "/verify-email", element: <VerifyEmail /> },
    { path: "/forgotpassword", element: <ForgotPassword /> },
    { path: "/resetpassword", element: <ResetPassword /> },
    { path: "/oauth-callback", element: <OAuthCallback /> },
    { path: "/about", element: <About /> },
];

// Only allow non-logged in users to enter the page (such as login, registration)
export const authRoutes = [
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
    },
];

// Only logged in users are allowed to enter the page
export const protectedRoutes = [
    {
        path: "/overview",
        element: (
            <ProtectedRoute>
                <Overview />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: "/changepassword",
        element: (
            <ProtectedRoute>
                <ChangePassword />
            </ProtectedRoute>
        ),
    },
    {
        path: "/expense",
        element: (
            <ProtectedRoute>
                <Expense />
            </ProtectedRoute>
        ),
    },
    {
        path: "/income",
        element: (
            <ProtectedRoute>
                <Income />
            </ProtectedRoute>
        ),
    },
    {
        path: "/transactions",
        element: (
            <ProtectedRoute>
                <Transactions />
            </ProtectedRoute>
        ),
    },
    {
        path: "/budgets",
        element: (
            <ProtectedRoute>
                <Budgets />
            </ProtectedRoute>
        ),
    },
    {
        path: "/goals",
        element: (
            <ProtectedRoute>
                <Goals />
            </ProtectedRoute>
        ),
    },
];

//Merge all routes (for <Routes>)
export const appRoutes = [
    ...publicRoutes,
    ...authRoutes,
    ...protectedRoutes,
    { path: "*", element: <NotFound /> },
];
