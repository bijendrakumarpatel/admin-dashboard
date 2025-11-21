import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../../layout/PublicLayout";
import { verifyOtp } from "../../api/authApi";
import useAuth from "../../context/useAuth";
import "./Auth.css";

export default function OTPVerify() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const payload = await verifyOtp({ identifier, otp });
      login({
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
      setMessage("OTP verified successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page">
        <h2 className="auth-page__title">Verify OTP</h2>
        <p className="auth-page__subtitle">
          Enter the OTP sent to your email or mobile number.
        </p>

        <form onSubmit={handleSubmit} className="auth-page__form">
          <label className="auth-page__label">Email / Phone</label>
          <input
            className="auth-page__input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com / 9876543210"
            required
          />

          <label className="auth-page__label">OTP</label>
          <input
            className="auth-page__input"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6 digit code"
            required
          />

          {error && <div className="auth-page__error">{error}</div>}
          {message && <div className="auth-page__message">{message}</div>}

          <button
            type="submit"
            className="auth-page__button"
            disabled={submitting}
          >
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}
