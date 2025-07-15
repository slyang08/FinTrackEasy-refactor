import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className="flex bg-green-800 justify-around items-center min-h-30">
            <Link to={"/contact"} className="text-white text-2xl hover:text-gray-300">
                Contact Us
            </Link>

            <span className="text-white font-bold text-2xl">&#169;2025 FinTrackEasy</span>

            <div className="flex gap-3">
                <Link to={"https://www.facebook.com/"}>
                    <FaFacebookF className="text-white text-3xl hover:text-gray-300" />
                </Link>
                <Link to={"https://x.com/"}>
                    <FaXTwitter className="text-white text-3xl hover:text-gray-300" />
                </Link>
                <Link to={"https://www.instagram.com/"}>
                    <FaInstagram className="text-white text-3xl hover:text-gray-300" />
                </Link>
            </div>
        </div>
    );
}
