import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { EyeClosed, Eye } from "lucide-react";
import "../App.css";
import Hearts from "./Hearts";
import CelebrationConfetti from "./Confetti";

const affirmations = [
  "What a smarty pants!",
  "Well done! 🎉",
  "Brilliant! ✨",
  "You're on fire! 🔥",
  "Absolutely correct!",
  "Fantastic!",
  "You nailed it! 💪",
  "Outstanding! 🏆",
  "Perfect! 💯",
  "You're amazing! 🚀",
  "Incredible! 🤩",
  "Spot on! 🎪",
  "You're a genius!",
  "Bravo! 👏",
  "Excellent work! 🎊",
];

export default function GuessForm({
  handleClick,
  question,
  guessThisWord,
  totalLives,
  remainingLives,
  onNextQuestion,
  word,
  onCorrectAnswer,
  onRanOutOfHearts,
  onRevealAnswer,
}) {
  const [formData, setFormData] = useState({
    guess: "",
  });

  // Confetti and celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [revealedWord, setRevealedWord] = useState(guessThisWord);
  const wordTilesRef = useRef(null);
  const [showRanOutOfHearts, setShowRanOutOfHearts] = useState(false);

  // Update revealedWord whenever guessThisWord changes (for wrong guesses)
  useEffect(() => {
    setRevealedWord(guessThisWord);
  }, [guessThisWord]);

  // Reset celebration state when question changes
  useEffect(() => {
    setShowCelebration(false);
    setCelebrationMessage("");
    setShowConfetti(false);
    setFormData({ guess: "" });
    setShowRanOutOfHearts(false);
  }, [question]);

  // Detect when hearts run out
  useEffect(() => {
    if (remainingLives <= 1 && !showRanOutOfHearts && !showCelebration) {
      console.log("Hearts reached 0, triggering ran out of hearts");
      setShowRanOutOfHearts(true);

      // Create the fully revealed word directly here
      const fullyRevealed = word.split("").map((char) => {
        if (char === " ") return " ";
        if (isPunctuation(char)) return char; // Keep punctuation as-is
        return char.toUpperCase();
      });
      setRevealedWord(fullyRevealed);

      // Track ran out of hearts
      if (onRanOutOfHearts) {
        onRanOutOfHearts();
      }
    }
  }, [
    remainingLives,
    showRanOutOfHearts,
    showCelebration,
    word,
    onRanOutOfHearts,
  ]);

  // Helper function to detect punctuation
  function isPunctuation(char) {
    return /[.,!?;:'"()[\]{}-]/.test(char);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const revealFullAnswer = useCallback(() => {
    // Create the fully revealed word
    const fullyRevealed = word.split("").map((char) => {
      if (char === " ") return " ";
      if (isPunctuation(char)) return char; // Keep punctuation as-is
      return char.toUpperCase();
    });

    // Update the revealed word state
    setRevealedWord(fullyRevealed);
  }, [word]);

  function handleSubmit(e) {
    e.preventDefault();

    console.log(
      "handleSubmit called - remainingLives:",
      remainingLives,
      "showCelebration:",
      showCelebration
    );

    // If celebration is already showing, prevent new submissions
    if (showCelebration) {
      console.log("Celebration showing, preventing submission");
      return;
    }

    const guess = formData.guess.trim();
    if (guess) {
      console.log("Calling handleClick with guess:", guess);
      const isCorrect = handleClick(guess);

      if (isCorrect) {
        // Show celebration
        const randomMessage =
          affirmations[Math.floor(Math.random() * affirmations.length)];
        setCelebrationMessage(randomMessage);
        setShowCelebration(true);
        setShowConfetti(true);
        revealFullAnswer();

        // Track correct answer
        if (onCorrectAnswer) {
          onCorrectAnswer();
        }
      } else {
        // Wrong guess, but not game over yet
        setFormData({ guess: "" });
      }
    }
  }

  function handleConfettiComplete() {
    setShowConfetti(false);
  }

  function handleNextQuestion() {
    setShowCelebration(false);
    setCelebrationMessage("");
    setRevealedWord(guessThisWord); // Reset to current guessThisWord
    if (onNextQuestion) {
      onNextQuestion();
    }
  }

  function handleNextQuestionAfterHeartsOut() {
    setShowRanOutOfHearts(false);
    if (onNextQuestion) {
      onNextQuestion();
    }
  }

  function handleRevealAnswer() {
    // When user clicks reveal, trigger the "ran out of hearts" flow
    // This means they're giving up and should lose all hearts
    if (onRevealAnswer) {
      onRevealAnswer();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-guess">
      <h2>{question}</h2>

      {/* Hearts component or ran out message - placed below question, above tiles */}
      {showRanOutOfHearts ? (
        <div className="ran-out-of-hearts-message">
          <h3 className="ran-out-message">Ran out of hearts!!</h3>
          <p className="answer-message">The answer was: {word}</p>
        </div>
      ) : (
        <Hearts totalLives={totalLives} remainingLives={remainingLives} />
      )}

      <div className="word-tiles" ref={wordTilesRef}>
        {revealedWord.map((letter, index) => {
          // Check if this is a space (word separator)
          if (letter === " ") {
            return (
              <span key={index} className="word-separator">
                ·
              </span>
            );
          }

          // Check if this is an underscore (empty tile)
          if (letter === "_ ") {
            return (
              <span key={index} className="letter-tile">
                {/* Empty tile - no text */}
              </span>
            );
          }

          // Check if this is punctuation
          if (isPunctuation(letter)) {
            return (
              <span key={index} className="punctuation-tile">
                {letter}
              </span>
            );
          }

          // This is a revealed letter
          return (
            <span key={index} className="letter-tile">
              {letter}
            </span>
          );
        })}
      </div>

      {/* Confetti component - only shows for correct answers */}
      <CelebrationConfetti
        trigger={showConfetti}
        onComplete={handleConfettiComplete}
        width={window.innerWidth}
        height={window.innerHeight}
        x={
          wordTilesRef.current
            ? wordTilesRef.current.offsetLeft +
              wordTilesRef.current.offsetWidth / 2
            : window.innerWidth / 2
        }
        y={
          wordTilesRef.current
            ? wordTilesRef.current.offsetTop +
              wordTilesRef.current.offsetHeight / 2
            : window.innerHeight / 2
        }
      />

      {/* Show celebration or input form */}
      {showCelebration ? (
        <div className="celebration-container">
          <h3 className="celebration-message">{celebrationMessage}</h3>
          <button
            type="button"
            className="next-question-btn"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        </div>
      ) : (
        <>
          {/* Input field - hide when revealed */}
          {!showRanOutOfHearts && (
            <input
              className="input--guess"
              name="guess"
              onChange={handleChange}
              value={formData.guess}
              placeholder="Enter your answer"
              autoFocus
              disabled={remainingLives <= 0}
            />
          )}

          <div className="form-buttons">
            {/* Submit button - hide when revealed */}
            {!showRanOutOfHearts && (
              <button type="submit" disabled={remainingLives <= 0}>
                Submit
              </button>
            )}

            {/* Next Question button - show when revealed */}
            {showRanOutOfHearts && (
              <button
                type="button"
                className="next-question-btn"
                onClick={handleNextQuestionAfterHeartsOut}
              >
                Next Question
              </button>
            )}
            {/* Eye icon - always visible, not wrapped in button */}
            <div className="eye-icon-container">
              {showRanOutOfHearts ? (
                <Eye size={20} className="eye-icon" />
              ) : (
                <EyeClosed
                  size={20}
                  className="eye-icon"
                  onClick={!showRanOutOfHearts ? handleRevealAnswer : undefined}
                  style={{
                    cursor: !showRanOutOfHearts ? "pointer" : "default",
                  }}
                  aria-label="Reveal answer (give up)"
                />
              )}
            </div>
          </div>
        </>
      )}
    </form>
  );
}

GuessForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  guessThisWord: PropTypes.array.isRequired,
  totalLives: PropTypes.number.isRequired,
  remainingLives: PropTypes.number.isRequired,
  onGameOver: PropTypes.func,
  onNextQuestion: PropTypes.func.isRequired,
  word: PropTypes.string.isRequired,
  onCorrectAnswer: PropTypes.func,
  onRanOutOfHearts: PropTypes.func,
  onRevealAnswer: PropTypes.func,
  isAlive: PropTypes.bool.isRequired,
  isBreaking: PropTypes.bool.isRequired,
  delay: PropTypes.number,
};
