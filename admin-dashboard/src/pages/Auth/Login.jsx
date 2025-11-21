import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../../layout/PublicLayout";
import { login as loginApi } from "../../api/authApi";
import useAuth from "../../context/useAuth";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State management
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // New State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = { 
        identifier: identifier, 
        password: password 
      };

      const responseData = await loginApi(payload);
      const token = responseData.accessToken || responseData.token || responseData.data?.token;
      const user = responseData.user || responseData.data?.user;

      if (!token) throw new Error("Authentication successful, but no token received.");

      await login({
        user: user,
        accessToken: token,
        refreshToken: responseData.refreshToken,
      });

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page">
        <h2 className="auth-page__title">Sign in</h2>
        <p className="auth-page__subtitle">
          Use your admin credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="auth-page__form">
          
          {/* EMAIL INPUT */}
          <div className="auth-page__group">
            <label className="auth-page__label" htmlFor="identifier">Email / Username</label>
            <input
              id="identifier"
              className="auth-page__input"
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@company.com"
              required
              autoComplete="username"
            />
          </div>

          {/* PASSWORD INPUT WITH EYE ICON */}
          <div className="auth-page__group">
            <label className="auth-page__label" htmlFor="password">Password</label>
            
            <div className="password-wrapper">
              <input
                id="password"
                className="auth-page__input"
                /* Toggles between 'text' and 'password' */
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              
              {/* The Eye Button */}
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  // Eye Off Icon (Hide)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  // Eye On Icon (Show)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-page__error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-page__button"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}