import { useState, useEffect } from "react";
import Navigation from "../components/Navigation.jsx";
import GuessForm from "../components/GuessForm.jsx";
import TopicForm from "../components/TopicForm.jsx";
import "../App.css";
import { motion } from "motion/react";

export default function Play() {
  const [trivia, setTrivia] = useState();
  const [topic, setTopic] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [word, setWord] = useState("");
  const [question, setQuestion] = useState("");
  const [guessThisWord, setGuessThisWord] = useState(
    word.split("").map(() => "_ ")
  );
  const [randomIndexes, setRandomIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Add error state
  const [error, setError] = useState(null);

  // Loading phrases
  const loadingPhrases = [
    `Crafting brain-bending questions about ${topic.toLowerCase()}...`,
    `Summoning trivia magic for ${topic.toLowerCase()}...`,
    `Brewing up some ${topic.toLowerCase()} knowledge...`,
    `AI is cooking up ${topic.toLowerCase()} questions...`,
  ];

  const [currentPhrase, setCurrentPhrase] = useState(0);

  // Loading animation letters
  const loadingLetters = [
    { letter: "L", delay: 0 },
    { letter: "O", delay: 0.1 },
    { letter: "A", delay: 0.2 },
    { letter: "D", delay: 0.3 },
    { letter: "I", delay: 0.4 },
    { letter: "N", delay: 0.5 },
    { letter: "G", delay: 0.6 },
  ];

  const renderLoadingLetter = ({ letter, delay }, index) => (
    <motion.span
      key={index}
      className="loading-letter-tile"
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: 1,
        delay,
        ease: "easeInOut",
      }}
    >
      {letter}
    </motion.span>
  );

  function generateRandomIndex() {
    return Math.floor(guessThisWord.length * Math.random());
  }

  console.log("the attempt is", attempt);
  console.log("the trivia is", trivia);
  console.log("the question is", question);

  useEffect(() => {
    if (topic) {
      fetchData(topic);
    }
  }, [topic]);

  useEffect(() => {
    if (trivia) {
      const newWord = trivia[attempt].Answer;
      const newQuestion = trivia[attempt].Question;
      setWord(newWord);
      setQuestion(newQuestion);

      // Create guessThisWord array with proper word separators and capitalized letters
      const guessArray = [];
      for (let i = 0; i < newWord.length; i++) {
        if (newWord[i] === " ") {
          guessArray.push(" "); // Space for word separator
        } else {
          guessArray.push("_ "); // Underscore for letter
        }
      }

      setGuessThisWord(guessArray);
      setRandomIndexes([]);
      return;
    }
  }, [attempt, trivia]);

  async function fetchData(topicSelected) {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("the api url is", apiUrl);
    setIsLoading(true);
    setCurrentPhrase(0);
    setError(null); // Clear any previous errors

    try {
      // Call your AI service with topic and count parameters
      const response = await fetch(
        `${apiUrl}/generate-trivia-set?topic=${encodeURIComponent(
          topicSelected
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("AI-generated trivia response:", data);

      // Transform the AI response to match your app's expected format
      const triviaList = data.questions.map((q) => ({
        Question: q.question,
        Answer: q.answer,
      }));

      console.log("Transformed trivia:", triviaList);
      setTrivia(triviaList);
    } catch (error) {
      console.error("Error fetching trivia from AI service:", error);

      // Show error instead of fallback
      setError(
        `Failed to generate trivia for "${topicSelected}". Please check your AI service and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Add function to retry
  function handleRetry() {
    setError(null);
    fetchData(topic);
  }

  // Cycle through loading phrases
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 1500); // Change phrase every 1.5 seconds

    return () => clearInterval(interval);
  }, [isLoading, loadingPhrases.length]);

  function moveToNextQuestion() {
    if (attempt < trivia.length - 1) {
      setAttempt((prev) => prev + 1);
    } else {
      alert("All questions exhausted");
    }
  }

  function handleClick(guess) {
    // Normalize both guess and word for comparison (case-insensitive)
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedWord = word.toLowerCase().trim();

    if (normalizedGuess !== normalizedWord) {
      if (randomIndexes.length === guessThisWord.length) {
        moveToNextQuestion();
        return;
      }
    } else {
      alert("Well done!");
      moveToNextQuestion();
      return;
    }

    let refIndex;
    do {
      refIndex = generateRandomIndex();
      console.log(`The refIndex is ${refIndex}`);
    } while (randomIndexes.includes(refIndex));

    setRandomIndexes((prev) => [...prev, refIndex]);
    setGuessThisWord((prevGuess) => {
      const updatedGuess = [...prevGuess];
      updatedGuess[refIndex] = word[refIndex].toUpperCase(); // Capitalize the revealed letter
      return updatedGuess;
    });
  }

  function handleSelect(data) {
    console.log(data);
    setTopic(data);
  }

  return (
    <div className="play-page">
      <Navigation isPlaying={true} />

      <main className="game-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-animation">
              <div className="loading-letters">
                {loadingLetters.map(renderLoadingLetter)}
              </div>
            </div>
            <motion.p
              className="loading-text"
              key={currentPhrase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {loadingPhrases[currentPhrase]}
            </motion.p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div className="error-buttons">
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
            </div>
          </div>
        ) : topic ? (
          <GuessForm
            handleClick={handleClick}
            question={question}
            guessThisWord={guessThisWord}
          />
        ) : (
          <TopicForm handleSelect={handleSelect} />
        )}
      </main>
    </div>
  );
}
