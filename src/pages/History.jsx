import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

export default function History() {
  const { user } = useAuth();
  const [gameSessions, setGameSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchGameHistory();
    }
  }, [user]);

  async function fetchGameHistory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGameSessions(data || []);
    } catch (error) {
      console.error("Error fetching game history:", error);
      setError("Failed to load game history");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSessionQuestions(sessionId) {
    try {
      const { data, error } = await supabase
        .from("game_questions")
        .select("*")
        .eq("session_id", sessionId)
        .order("question_order");

      if (error) throw error;
      setSessionQuestions(data || []);
    } catch (error) {
      console.error("Error fetching session questions:", error);
    }
  }

  function handleSessionClick(session) {
    setSelectedSession(session);
    fetchSessionQuestions(session.id);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getScoreEmoji(percentage) {
    if (percentage === 100) return "🏆";
    if (percentage >= 90) return "🧠";
    if (percentage >= 75) return "⭐";
    if (percentage >= 60) return "🎯";
    if (percentage >= 40) return "📚";
    return "��";
  }

  if (!user) {
    return (
      <div className="history-page">
        <Navigation isPlaying={false} />
        <main className="main-content">
          <div className="auth-required">
            <h2>Sign in to view your game history</h2>
            <p>
              Your scores and game history will be saved when you're logged in.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="history-page">
        <Navigation isPlaying={false} />
        <main className="main-content">
          <div className="loading-container">
            <h2>Loading your game history...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <Navigation isPlaying={false} />
        <main className="main-content">
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchGameHistory} className="retry-btn">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="history-page">
      <Navigation isPlaying={false} />

      <main className="main-content">
        <h1>Your Game History</h1>

        {gameSessions.length === 0 ? (
          <div className="no-history">
            <h2>No games played yet!</h2>
            <p>Start playing to see your scores and history here.</p>
          </div>
        ) : (
          <div className="history-container">
            <div className="sessions-list">
              <h2>Recent Games</h2>
              {gameSessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-card ${
                    selectedSession?.id === session.id ? "selected" : ""
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="session-header">
                    <span className="session-topic">{session.topic}</span>
                    <span className="session-date">
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                  <div className="session-score">
                    <span className="score-emoji">
                      {getScoreEmoji(session.score_percentage)}
                    </span>
                    <span className="score-text">
                      {session.correct_answers}/{session.total_questions} (
                      {session.score_percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedSession && (
              <div className="session-details">
                <h3>Game Details: {selectedSession.topic}</h3>
                <div className="session-summary">
                  <p>Played on: {formatDate(selectedSession.created_at)}</p>
                  <p>
                    Score: {selectedSession.correct_answers}/
                    {selectedSession.total_questions} (
                    {selectedSession.score_percentage.toFixed(1)}%)
                  </p>
                </div>

                <div className="questions-list">
                  <h4>Questions & Answers</h4>
                  {sessionQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`question-item ${
                        question.is_correct ? "correct" : "incorrect"
                      }`}
                    >
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <span className="question-result">
                          {question.is_correct ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="question-text">
                        {question.question_text}
                      </div>
                      <div className="question-answer">
                        <strong>Answer:</strong> {question.correct_answer}
                        {question.user_answer && (
                          <span className="user-answer">
                            <br />
                            <strong>Your answer:</strong> {question.user_answer}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
