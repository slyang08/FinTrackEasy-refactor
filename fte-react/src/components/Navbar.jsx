import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useState } from "react";
import { Link } from "react-router-dom";

import { isAuthenticated } from "../atoms/Atom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuth] = useAtom(isAuthenticated);

    function navItemClicked() {
        setIsOpen(false);
    }

    return (
        <nav className="flex justify-between items-center bg-green-800 px-3 h-10 ">
            <Link to="/" className="font-bold text-white text-2xl">
                FinTrackEasy
            </Link>

            <div
                className="relative group inline"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                {/* User Icon */}
                <FontAwesomeIcon icon={faCircleUser} className="text-white text-2xl" />

                {/* Dropdown (hidden by default) */}
                <div
                    className={`absolute top-full right-0 mt-1 bg-white rounded-md shadow-xl ${isOpen ? "visible" : "invisible"} duration-200 z-10 min-w-[160px]`}
                >
                    <ul className="p-2">
                        <li>
                            <Link
                                to={"/login"}
                                className={`text-gray-700 hover:text-gray-300 p-3 ${isAuth && "hidden"}`}
                                onClick={navItemClicked}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/profile"}
                                className={`text-gray-700 hover:text-gray-300 p-3 ${!isAuth && "hidden"}`}
                                onClick={navItemClicked}
                            >
                                Profile
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
