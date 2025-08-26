import { useState, useEffect } from "react";
import Navigation from "../components/Navigation.jsx";
import GuessForm from "../components/GuessForm.jsx";
import TopicForm from "../components/TopicForm.jsx";
import "../App.css";

// Mock trivia data for testing
const MOCK_TRIVIA = {
  history: [
    {
      Question: "Who was the first President of the United States?",
      Answer: "George Washington",
    },
    { Question: "In what year did World War II end?", Answer: "1945" },
    {
      Question: "What ancient wonder was located in Alexandria?",
      Answer: "Lighthouse",
    },
    {
      Question: "Who discovered America in 1492?",
      Answer: "Christopher Columbus",
    },
    {
      Question: "What empire was ruled by Julius Caesar?",
      Answer: "Roman Empire",
    },
  ],
  science: [
    { Question: "What is the chemical symbol for gold?", Answer: "Au" },
    { Question: "What planet is known as the Red Planet?", Answer: "Mars" },
    {
      Question: "What is the hardest natural substance on Earth?",
      Answer: "Diamond",
    },
    {
      Question: "What gas do plants absorb from the air?",
      Answer: "Carbon Dioxide",
    },
    {
      Question: "What is the largest organ in the human body?",
      Answer: "Skin",
    },
  ],
  sports: [
    {
      Question: "What sport is known as the beautiful game?",
      Answer: "Soccer",
    },
    { Question: "How many players are on a basketball team?", Answer: "Five" },
    { Question: "What country has won the most World Cups?", Answer: "Brazil" },
    { Question: "What is the national sport of Japan?", Answer: "Sumo" },
    {
      Question: "In what year was the first modern Olympics held?",
      Answer: "1896",
    },
  ],
};

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
    // Use mock data instead of API call
    console.log("Fetching mock data for topic:", topicSelected);

    // Find relevant trivia based on topic
    let triviaList = [];

    // Check if topic matches any of our mock categories
    const topicLower = topicSelected.toLowerCase();
    if (
      topicLower.includes("history") ||
      topicLower.includes("president") ||
      topicLower.includes("war")
    ) {
      triviaList = MOCK_TRIVIA.history;
    } else if (
      topicLower.includes("science") ||
      topicLower.includes("chemical") ||
      topicLower.includes("planet")
    ) {
      triviaList = MOCK_TRIVIA.science;
    } else if (
      topicLower.includes("sport") ||
      topicLower.includes("game") ||
      topicLower.includes("olympic")
    ) {
      triviaList = MOCK_TRIVIA.sports;
    } else {
      // Default to history if no specific match
      triviaList = MOCK_TRIVIA.history;
    }

    console.log("Mock trivia found:", triviaList);
    setTrivia(triviaList);
  }

  function moveToNextQuestion() {
    if (attempt < trivia.length - 1) {
      setAttempt((prev) => prev + 1);
    } else {
      alert("All questions exhausted");
    }
  }

  function handleClick(guess) {
    if (guess != word) {
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
        {topic ? (
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
