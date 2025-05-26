import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className="flex bg-green-800 justify-around items-center min-h-30">
            <Link to={"/contact"} className="text-white text-2xl hover:text-gray-300">
                Contact Us
            </Link>

            <text className="text-white font-bold text-2xl">&#169;2025 FinTrackEasy</text>

            <div>
                <Link to={"https://www.facebook.com/"}>
                    <FontAwesomeIcon
                        icon={faFacebookF}
                        className="text-white text-3xl mx-1.5 hover:text-gray-300"
                    />
                </Link>
                <Link to={"https://x.com/"}>
                    <FontAwesomeIcon
                        icon={faXTwitter}
                        className="text-white text-3xl mx-1.5 hover:text-gray-300"
                    />
                </Link>
                <Link to={"https://www.instagram.com/"}>
                    <FontAwesomeIcon
                        icon={faInstagram}
                        className="text-white text-3xl mx-1.5 hover:text-gray-300"
                    />
                </Link>
                {/* <FontAwesomeIcon icon={faEnvelope} className="text-white text-3xl mx-1.5"/> */}
            </div>
        </div>
    );
}
