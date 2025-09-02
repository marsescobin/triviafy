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

  // Add lives state
  const [totalLives, setTotalLives] = useState(0);
  const [remainingLives, setRemainingLives] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [allQuestionsComplete, setAllQuestionsComplete] = useState(false);

  // Calculate lives when word changes
  useEffect(() => {
    if (word) {
      // Count unique letters, excluding punctuation and spaces
      const uniqueLetters = new Set(
        word
          .toLowerCase()
          .replace(/[.,!?;:'"()[\]{}-]/g, "") // Remove punctuation
          .replace(/\s/g, "") // Remove spaces
      ).size;

      setTotalLives(uniqueLetters);
      setRemainingLives(uniqueLetters);
    }
  }, [word]);

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
      // All questions completed - show end game screen
      setAllQuestionsComplete(true);
    }
  }

  function handleClick(guess) {
    // Normalize both guess and word for comparison (case-insensitive)
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedWord = word.toLowerCase().trim();

    if (normalizedGuess !== normalizedWord) {
      // Wrong guess - decrease lives
      setRemainingLives((prev) => prev - 1);

      if (randomIndexes.length === guessThisWord.length) {
        moveToNextQuestion();
        return false; // Return false for wrong guess
      }
    } else {
      // Correct guess - no lives lost, don't auto-advance
      return true; // Return true for correct guess
    }

    let refIndex;
    do {
      refIndex = generateRandomIndex();
      console.log(`The refIndex is ${refIndex}`);
    } while (randomIndexes.includes(refIndex));

    setRandomIndexes((prev) => [...prev, refIndex]);
    setGuessThisWord((prevGuess) => {
      const updatedGuess = [...prevGuess];
      updatedGuess[refIndex] = word[refIndex].toUpperCase();
      return updatedGuess;
    });

    return false; // Return false for wrong guess
  }

  function handleSelect(data) {
    console.log(data);
    setTopic(data);
  }

  // Add game over handler
  function handleGameOver() {
    console.log("Game Over! No more lives left.");
    // You can add game over logic here
    // For example: show a game over modal, reset the game, etc.
  }

  function handleCorrectAnswer() {
    setScore((prev) => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
    }));
  }

  function handleRanOutOfHearts() {
    setScore((prev) => ({ ...prev, total: prev.total + 1 }));
  }

  function resetGame() {
    setScore({ correct: 0, total: 0 });
    setAllQuestionsComplete(false);
    setAttempt(0);
  }

  function chooseNewTopic() {
    resetGame();
    setTopic("");
    setTrivia(null);
  }

  function getScoreMessage(correct, total) {
    const percentage = (correct / total) * 100;

    if (percentage === 100) {
      return { emoji: "🏆", message: "Perfect Score!" };
    } else if (percentage >= 90) {
      return { emoji: "🧠", message: "Knowledge Master!" };
    } else if (percentage >= 75) {
      return { emoji: "⭐", message: "Trivia Star!" };
    } else if (percentage >= 60) {
      return { emoji: "🎯", message: "Well Done!" };
    } else if (percentage >= 40) {
      return { emoji: "📚", message: "Keep Learning!" };
    } else {
      return { emoji: "💪", message: "Don't Give Up!" };
    }
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
        ) : allQuestionsComplete ? (
          <div className="game-complete-container">
            {(() => {
              const { emoji, message } = getScoreMessage(
                score.correct,
                score.total
              );
              return (
                <>
                  <h2>
                    {emoji} {message}
                  </h2>
                  <p>
                    You got {score.correct}/{score.total} right on {topic}!
                  </p>
                </>
              );
            })()}
            <div className="completion-buttons">
              <button onClick={resetGame} className="next-question-btn">
                Play Again
              </button>
              <button onClick={chooseNewTopic} className="next-question-btn">
                New Topic
              </button>
            </div>
          </div>
        ) : topic ? (
          <GuessForm
            handleClick={handleClick}
            question={question}
            guessThisWord={guessThisWord}
            totalLives={totalLives}
            remainingLives={remainingLives}
            onGameOver={handleGameOver}
            onNextQuestion={moveToNextQuestion}
            word={word} // Add word prop
            onCorrectAnswer={handleCorrectAnswer}
            onRanOutOfHearts={handleRanOutOfHearts}
          />
        ) : (
          <TopicForm handleSelect={handleSelect} />
        )}
      </main>
    </div>
  );
}
