import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "../App.css";

export default function Navigation({ isPlaying = false }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="header">
      <Link to="/" className="logo">
        Triviafy
      </Link>
      <nav className="nav">
        {/* Show Play link on home page, hide only when actively playing a game */}
        {(!isPlaying || isHomePage) && (
          <Link to="/play" className="nav-link">
            Play
          </Link>
        )}
        <Link to="/login" className="nav-link">
          Sign In
        </Link>
      </nav>
    </header>
  );
}

Navigation.propTypes = {
  isPlaying: PropTypes.bool,
};
