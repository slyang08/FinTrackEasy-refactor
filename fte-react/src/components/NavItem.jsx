import { Link } from "react-router-dom";

export default function NavItem({ target, text, onClick }) {
    return (
        <Link to={target} className="text-gray-700 hover:text-gray-300 px-3" onClick={onClick}>
            {text}
        </Link>
    );
}
