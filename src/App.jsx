import { useState, useEffect } from "react";
import "./App.css";
import { data } from "./assets/Data.js";
import GuessForm from "./components/GuessForm.jsx";
import TopicForm from "./components/TopicForm.jsx";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

  const TriviaSchema = z.object({
    triviaList: z.array(
      z.object({
        Question: z.string(),
        Answer: z.string(),
      })
    ),
  });

  async function fetchData(topicSelected) {
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
            content: `Get me 5 trivias about ${topicSelected}`,
          },
        ],
        response_format: zodResponseFormat(TriviaSchema, "triviaList"),
        max_tokens: 300,
      });
      const triviaListObject = JSON.parse(response.choices[0].message.content);
      setTrivia(triviaListObject.triviaList);
      console.log(trivia);
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
