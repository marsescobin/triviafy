import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

const getUserDisplayName = (user) => {
  if (!user?.email) return "User";

  const email = user.email;
  const namePart = email.split("@")[0];

  // Convert common patterns
  if (namePart.includes(".")) {
    return namePart
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  // Handle underscores
  if (namePart.includes("_")) {
    return namePart
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  // Default: capitalize first letter
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

export default function History() {
  const { user } = useAuth();
  const [gameSessions, setGameSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  // Remove isQuestionsExpanded state - no longer needed

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
    // If clicking the same session, toggle the details
    if (selectedSession?.id === session.id) {
      setIsDetailsExpanded(!isDetailsExpanded);
    } else {
      // If clicking a different session, select it and expand details
      setSelectedSession(session);
      setIsDetailsExpanded(true);
      fetchSessionQuestions(session.id);
    }
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
    return "";
  }

  if (!user) {
    return (
      <div className="history-page">
        <Navigation isPlaying={false} />
        <main className="main-content">
          <div className="auth-required">
            <h2>Sign in to view your game history</h2>
            <p>
              Your scores and game history will be saved when you&apos;re logged
              in.
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
        <h1>{getUserDisplayName(user)}&apos;s Trivia History</h1>

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
                <div key={session.id} className="session-wrapper">
                  <div
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

                  {selectedSession?.id === session.id && isDetailsExpanded && (
                    <div className="session-details">
                      <div className="questions-list">
                        <h4>
                          Questions & Answers ({sessionQuestions.length}{" "}
                          questions)
                        </h4>

                        {sessionQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className={`question-item ${
                              question.is_correct ? "correct" : "incorrect"
                            }`}
                          >
                            <div className="question-text">
                              {question.question_text}
                            </div>
                            <div className="question-answer">
                              <strong>Answer:</strong> {question.correct_answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
