import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import "../App.css";
import PropTypes from "prop-types";

// Move TopicItem outside the main component to prevent redefinition on every render
const TopicItem = React.memo(({ topic, onSelect }) => {
  const itemRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateItemVisibility = () => {
      if (!itemRef.current) return;

      const rect = itemRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const itemCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      // Calculate distance from viewport center
      const distance = Math.abs(itemCenter - viewportCenter);
      const maxDistance = viewportHeight / 2;

      // Calculate opacity based on distance (items in center are fully visible)
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const newOpacity = Math.max(0.1, 1 - Math.pow(normalizedDistance, 1.5));
      const newScale = Math.max(0.8, 1 - normalizedDistance * 0.2);

      setOpacity(newOpacity);
      setScale(newScale);
    };

    updateItemVisibility();
    window.addEventListener("scroll", updateItemVisibility);
    window.addEventListener("resize", updateItemVisibility);

    return () => {
      window.removeEventListener("scroll", updateItemVisibility);
      window.removeEventListener("resize", updateItemVisibility);
    };
  }, []);

  return (
    <motion.li
      ref={itemRef}
      style={{
        opacity,
        scale,
      }}
      transition={{
        opacity: { duration: 0.2, ease: "easeOut" },
        scale: { duration: 0.2, ease: "easeOut" },
      }}
      whileHover={{
        scale: scale * 1.05,
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: scale * 0.98 }}
      onClick={() => onSelect(topic)}
      className="topic-item"
    >
      {topic}
    </motion.li>
  );
});

TopicItem.displayName = "TopicItem";

TopicItem.propTypes = {
  topic: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default function TopicForm({ handleSelect }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const { user } = useAuth();

  const triviaTopics = [
    "Ancient History",
    "World War II",
    "Space Exploration",
    "Human Anatomy",
    "Classic Rock Music",
    "Renaissance Art",
    "Chemistry Basics",
    "Jazz Legends",
    "Egyptian Pyramids",
    "Evolution Theory",
    "Hip Hop Culture",
    "Roman Empire",
    "Climate Science",
    "Classical Music",
    "Modern Pop",
  ];

  const handleCustomTopicSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleSelect(customTopic.trim());
      setCustomTopic("");
      setShowCustomInput(false);
    }
  };

  if (selectedTopic) {
    return (
      <div className="topic-selected">
        <h2>Selected: {selectedTopic}</h2>
        <button onClick={() => setSelectedTopic(null)}>
          Choose Different Topic
        </button>
        <button onClick={() => handleSelect(selectedTopic)}>Start Quiz</button>
      </div>
    );
  }

  return (
    <div className="topic-form-container">
      <h2>What topic would you like to be quizzed on?</h2>

      <ul className="topics-list">
        {triviaTopics.map((topic, index) => (
          <TopicItem
            key={index}
            topic={topic}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </ul>

      <AnimatePresence mode="wait">
        {!showCustomInput ? (
          <motion.button
            key="add-button"
            className="custom-topic-button"
            onClick={() =>
              user
                ? setShowCustomInput(true)
                : (window.location.href = "/login")
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            + Add Custom Topic
          </motion.button>
        ) : (
          <motion.form
            key="custom-input"
            onSubmit={handleCustomTopicSubmit}
            className="custom-topic-form"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Type your custom topic..."
              className="custom-topic-input"
              autoFocus
            />
            <div className="custom-topic-buttons">
              <button type="submit" className="submit-topic-btn">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="cancel-topic-btn"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

TopicForm.propTypes = {
  handleSelect: PropTypes.func.isRequired,
};
