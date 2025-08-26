import { Link } from "react-router-dom";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

export default function Home() {
  return (
    <div className="home">
      {/* Header Navigation */}
      <Navigation isPlaying={false} />

      {/* Main Content */}
      <main className="main-content">
        <h1 className="headline">
          Turn any topic into a
          <br />
          <div className="word-game-tiles">
            <span className="letter-tile">W</span>
            <span className="letter-tile">O</span>
            <span className="letter-tile">R</span>
            <span className="letter-tile">D</span>
            <br />
            <span className="letter-tile">G</span>
            <span className="letter-tile">A</span>
            <span className="letter-tile">M</span>
            <span className="letter-tile">E</span>
          </div>
        </h1>
        <p className="subtext">
          You&apos;ll have as many lives as there are unique letters. Can you
          guess them all?
        </p>

        <div className="cta-buttons">
          <Link to="/play" className="btn btn-primary">
            Start playing
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign up
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Made by Mars</p>
      </footer>
    </div>
  );
}
