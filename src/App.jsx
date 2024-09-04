import { useState, useEffect } from "react";
import "./App.css";
import { data } from "./assets/Data.js";

// Create form for sending answer

export default function App() {
  const [attempt, setAttempt] = useState(0);
  const [word, setWord] = useState(data[0].Answer);
  const [question, setQuestion] = useState(data[0].Question);
  const [guessThisWord, setGuessThisWord] = useState(
    word.split("").map(() => "_ ")
  );
  const [randomIndexes, setRandomIndexes] = useState([]);
  console.log(`data length is ${data.length} and attempt is ${attempt}`);

  function generateRandomIndex() {
    return Math.floor(guessThisWord.length * Math.random());
  }

  useEffect(() => {
    const newWord = data[attempt].Answer;
    const newQuestion = data[attempt].Question;
    setWord(newWord);
    setQuestion(newQuestion);
    setGuessThisWord(newWord.split("").map(() => "_ "));
    setRandomIndexes([]);
    console.log(`The new word is ${newWord} and attempt is ${attempt}`);
    return;
  }, [attempt]);

  function handleClick() {
    if (randomIndexes.length === guessThisWord.length) {
      if (attempt < data.length - 1) {
        return setAttempt((prev) => prev + 1);
      } else {
        return alert("All questions have been exhausted");
      }
    }

    let refIndex;

    do {
      refIndex = generateRandomIndex();
      console.log(`The refIndex is ${refIndex}`);
    } while (randomIndexes.includes(refIndex));

    setRandomIndexes((prev) => [...prev, refIndex]);
    setGuessThisWord((prevGuess) => {
      const updatedGuess = [...prevGuess];
      updatedGuess[refIndex] = word[refIndex];
      return updatedGuess;
    });
  }

  return (
    <>
      <h2>{question}</h2>
      <h3>{guessThisWord.join("")}</h3>
      <button onClick={handleClick}>Send</button>
    </>
  );
}
