import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const word = "Elephant";
  const [guessThisWord, setGuessThisWord] = useState(
    word.split("").map(() => "_ ")
  );
  const [randomIndexes, setRandomIndexes] = useState([]);

  function generateRandomIndex() {
    return Math.floor(guessThisWord.length * Math.random());
  }

  function handleClick() {
    if (randomIndexes.length === guessThisWord.length) {
      alert("Congrats!!");
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
      updatedGuess[refIndex] = word[refIndex];
      return updatedGuess;
    });
  }

  return (
    <>
      <h1>{guessThisWord.join("")}</h1>
      <button onClick={handleClick}>Send</button>
    </>
  );
}
