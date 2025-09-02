import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

export default function Navigation({ isPlaying = false }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isHomePage = location.pathname === "/";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

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

        {user ? (
          <div className="nav-user">
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="nav-link sign-out-btn">
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

Navigation.propTypes = {
  isPlaying: PropTypes.bool,
};
