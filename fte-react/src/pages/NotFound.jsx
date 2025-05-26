// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Page Not Found</h2>
            <p className="mb-6 text-gray-500">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition"
            >
                Back to Home page.
            </Link>
        </div>
    );
}
