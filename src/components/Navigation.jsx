import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

const getUserDisplayName = (user) => {
  if (!user?.email) return "User";

  const email = user.email;
  const namePart = email.split("@")[0];

  // Convert common patterns
  if (namePart.includes(".")) {
    return namePart
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  // Handle underscores
  if (namePart.includes("_")) {
    return namePart
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  // Default: capitalize first letter
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

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

        {/* Show History link for logged-in users */}
        {user && (
          <Link to="/history" className="nav-link">
            History
          </Link>
        )}

        {user ? (
          <div className="nav-user">
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
