import { useState, useEffect } from "react";
import "./App.css";
import { data } from "./assets/Data.js";
import GuessForm from "./components/GuessForm.jsx";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

// Make a call to openAI trying to get a bunch of questions and answers

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
    return;
  }, [attempt]);

  const userPrompt = "Walla Walla Washington";
  const TriviaSchema = z.object({
    triviaList: z.array(
      z.object({
        Question: z.string(),
        Answer: z.string(),
      })
    ),
  });

  const fetchData = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `You are a trivia master that outputs a list of trivias in JSON format.
              A trivia must have a Question and Answer pair. The answer needs to be one to a few words only with no punctuation marks`,
          },
          {
            role: "user",
            content: `Get me 5 trivias about ${userPrompt}`,
          },
        ],
        response_format: zodResponseFormat(TriviaSchema, "triviaList"),
        max_tokens: 300,
      });
      const triviaListObject = JSON.parse(response.choices[0].message.content);
      console.log(triviaListObject);
      console.log(triviaListObject.triviaList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function moveToNextQuestion() {
    if (attempt < data.length - 1) {
      setAttempt((prev) => prev + 1);
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
      updatedGuess[refIndex] = word[refIndex];
      return updatedGuess;
    });
  }

  return (
    <>
      <h2>{question}</h2>
      <h3>{guessThisWord.join("")}</h3>
      <GuessForm handleClick={handleClick} />
      <button onClick={fetchData}>Fetch Data Test</button>
    </>
  );
}
