import { useState, useEffect } from "react";
import "./App.css";
import GuessForm from "./components/GuessForm.jsx";
import TopicForm from "./components/TopicForm.jsx";
import { z } from "zod";

// Make a call to openAI trying to get a bunch of questions and answers

export default function App() {
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
      setGuessThisWord(newWord.split("").map(() => "_ "));
      setRandomIndexes([]);
      return;
    }
  }, [attempt, trivia]);

  async function fetchData(topicSelected) {
    const messages = [
      {
        role: "system",
        content:
          "You are a trivia master that outputs a list of trivias in JSON format. A trivia must have a Question and Answer pair. The answer needs to be one to a few words only with no punctuation marks",
      },
      {
        role: "user",
        content: `Get me 5 trivias about ${topicSelected}`,
      },
    ];
    try {
      const url = "https://openai-api-worker.marsescobin.workers.dev/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });
      const dataFromOpenAI = await response.json();
      const triviaListObject = JSON.parse(
        dataFromOpenAI.choices[0].message.content
      ); // Parse the JSON string
      console.log("triviaListObject", triviaListObject);
      setTrivia(triviaListObject.triviaList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      updatedGuess[refIndex] = word[refIndex];
      return updatedGuess;
    });
  }

  function handleSelect(data) {
    console.log(data);
    setTopic(data);
  }

  return (
    <>
      {topic ? (
        <GuessForm
          handleClick={handleClick}
          question={question}
          guessThisWord={guessThisWord}
        />
      ) : (
        <TopicForm handleSelect={handleSelect} />
      )}
    </>
  );
}
