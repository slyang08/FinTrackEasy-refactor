import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

import NavItem from "./NavItem";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                    className={`absolute top-full right-0 mt-1 bg-white rounded-md shadow-xl ${isOpen ? "visible" : "invisible"} duration-50 z-10 min-w-[160px]`}
                >
                    <ul className="p-2">
                        <li>
                            <NavItem target={"/login"} text={"Login"} onClick={navItemClicked} />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
