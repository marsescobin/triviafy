import { useState } from "react";
import "../App.css";

export default function GuessForm({ handleClick }) {
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
