import { useState, useEffect } from "react";
import "./App.css";
import { data } from "./assets/Data.js";

//NEXT: Figure out how to log an alert once words are done

export default function App() {
  const [attempt, setAttempt] = useState(0);
  const [word, setWord] = useState(data[attempt].Answer);
  const [guessThisWord, setGuessThisWord] = useState(
    word.split("").map(() => "_ ")
  );
  const [randomIndexes, setRandomIndexes] = useState([]);

  function generateRandomIndex() {
    return Math.floor(guessThisWord.length * Math.random());
  }

  useEffect(() => {
    if (attempt <= data.length - 1) {
      const newWord = data[attempt].Answer;
      setWord(newWord);
      setGuessThisWord(newWord.split("").map(() => "_ "));
      setRandomIndexes([]);
      console.log(`The new word is ${word} and attempt is ${attempt}`);
    } else {
      console.log("All questions exhausted");
      return alert("All questions are exhausted");
    }
  }, [attempt]);

  function handleClick() {
    if (randomIndexes.length === guessThisWord.length) {
      console.log(attempt);
      return setAttempt((prev) => prev + 1);
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
      <h2>{data[attempt].Question}</h2>
      <h3>{guessThisWord.join("")}</h3>
      <button onClick={handleClick}>Send</button>
    </>
  );
}
