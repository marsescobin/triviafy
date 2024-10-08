import { useState } from "react";
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
    handleClick(formData.guess);
  }

  return (
    <form onSubmit={handleSubmit} className="form--guess">
      <h2>{question}</h2>
      <h3>{guessThisWord}</h3>
      <input
        className="input--guess"
        name="guess"
        onChange={handleChange}
        value={formData.guess}
        placeholder="Enter your answer"
      />
      <button>Submit</button>
    </form>
  );
}
