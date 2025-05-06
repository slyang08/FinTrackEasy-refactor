import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Terms from "./pages/Terms.jsx";

function App() {
    return (
        <Router>
            <div>
                <h1 className="text-4xl font-bold text-blue-500">FinTrackEasy</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
