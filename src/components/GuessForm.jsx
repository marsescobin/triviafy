import { useState } from "react";
import PropTypes from "prop-types";
import "../App.css";

export default function GuessForm({ handleClick, question, guessThisWord }) {
  const [formData, setFormData] = useState({
    guess: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const guess = formData.guess.trim(); // Trim whitespace
    if (guess) {
      handleClick(guess);
      // Clear the input field after submission
      setFormData({ guess: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form--guess">
      <h2>{question}</h2>
      <div className="word-tiles">
        {guessThisWord.map((letter, index) => {
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

          // This is a revealed letter
          return (
            <span key={index} className="letter-tile">
              {letter}
            </span>
          );
        })}
      </div>
      <input
        className="input--guess"
        name="guess"
        onChange={handleChange}
        value={formData.guess}
        placeholder="Enter your answer"
        autoFocus // Auto-focus for better UX
      />
      <button>Submit</button>
    </form>
  );
}

GuessForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  guessThisWord: PropTypes.array.isRequired,
};
