import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

export default function Home() {
  const wordGameLetters = [
    { letter: "W", delay: 0 },
    { letter: "O", delay: 0.1 },
    { letter: "R", delay: 0.2 },
    { letter: "D", delay: 0.3 },
    { letter: "G", delay: 0.4 },
    { letter: "A", delay: 0.5 },
    { letter: "M", delay: 0.6 },
    { letter: "E", delay: 0.7 },
  ];

  const renderLetterTile = ({ letter, delay }, index) => (
    <motion.span
      key={index}
      className="letter-tile"
      animate={{ y: [0, -30, 0] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2,
        delay,
      }}
    >
      {letter}
    </motion.span>
  );

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
            {wordGameLetters.slice(0, 4).map(renderLetterTile)}
            <br />
            {wordGameLetters.slice(4).map(renderLetterTile)}
          </div>
        </h1>
        <p className="subtext">
          You&apos;ll have as many lives as there are unique letters.
          <br />
          Can you guess them all?
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
        <p>
          Made by Mars |{" "}
          <a
            href="https://buymeacoffee.com/marsescobin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy me ice cream
          </a>
        </p>
      </footer>
    </div>
  );
}
