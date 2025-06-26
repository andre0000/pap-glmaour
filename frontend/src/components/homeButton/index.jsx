import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./styles.css";

const HomeButton = () => (
  <Link to="/" className="floating-home-btn" title="Home">
    <FaHome size={18} />
  </Link>
);

export default HomeButton;
