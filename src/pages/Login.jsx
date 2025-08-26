import { Link } from "react-router-dom";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

export default function Login() {
  return (
    <div className="login-page">
      <Navigation isPlaying={false} />

      <main className="login-content">
        <h1>Sign In</h1>
        <p>Authentication features coming soon!</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
