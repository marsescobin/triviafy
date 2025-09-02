import { useState } from "react";
import { supabase } from "../lib/supabase";
import Navigation from "../components/Navigation.jsx";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setIsOtpSent(true);
      setMessage("Check your email for the OTP code!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      setMessage("Successfully signed in!");
      // Redirect to play page or dashboard
      window.location.href = "/play";
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navigation isPlaying={false} />

      <main className="main-content">
        <div className="auth-container">
          <h1>Sign In to Triviafy</h1>

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="auth-form">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <label htmlFor="otp">Enter OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code from your email"
                required
                maxLength="6"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="back-btn"
              >
                Back to Email
              </button>
            </form>
          )}

          {message && (
            <div
              className={`message ${
                message.includes("Success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
