import { useState } from "react";
import "../App.css";

export default function TopicForm({ handleSelect }) {
  const [formData, setFormData] = useState({
    topic: "",
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
    handleSelect(formData.topic);
  }
  return (
    <form onSubmit={handleSubmit} className="form-guess">
      <label htmlFor="topic" className="label--topic">
        <h2>What topic would you like to be quizzed on?</h2>
      </label>
      <input
        className="input--guess"
        onChange={handleChange}
        type="text"
        name="topic"
        id="topic"
        value={formData.topic}
        placeholder="History of rock and roll"
      />
      <button>Submit</button>
    </form>
  );
}
