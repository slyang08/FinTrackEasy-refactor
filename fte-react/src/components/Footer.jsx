import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className="bg-white text-black p-11">
            <div className="border-1 mb-5" />

            <div className="flex justify-between items-center">
                <div className="font-roboto">
                    <Link to="/" className="flex items-center text-lg hover:text-gray-300">
                        <img src="fte-logo-final.svg" alt="fte-logo" className="h-10" />
                        FinTrack<span className="font-bold ">Easy</span>
                    </Link>
                </div>

                <div className="flex gap-5">
                    <div className="text-[14px]">&copy;2025 FinTrackEasy. All rights reserved.</div>
                    <Link to="/" className="underline text-[14px] hover:text-gray-300">
                        Privacy Policy
                    </Link>
                    <Link to="/" className="underline text-[14px] hover:text-gray-300">
                        Terms of Service
                    </Link>
                    <Link to="/" className="underline text-[14px] hover:text-gray-300">
                        Cookies Settings
                    </Link>
                </div>

                <div className="flex gap-3">
                    <Link to={"https://www.facebook.com/"}>
                        <FaFacebook className="text-black text-xl hover:text-gray-300" />
                    </Link>
                    <Link to={"https://www.instagram.com/"}>
                        <FaInstagram className="text-black text-xl hover:text-gray-300" />
                    </Link>
                    <Link to={"https://x.com/"}>
                        <FaXTwitter className="text-black text-xl hover:text-gray-300" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
