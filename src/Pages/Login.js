import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext"; // Import ProfileContex
import API_BASE_URL from "../config";
import "../CSS/Login.css";

// Create Axios Instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // Set the base URL
});

// Add Interceptor to Attach Authorization Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config; // Return the updated config
  },
  (error) => Promise.reject(error) // Handle errors
);

function Login() {
  const { fetchProfileData } = useContext(ProfileContext); // Access fetchProfileData
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [forgotMessage, setForgotMessage] = useState(""); // For forgot password feedback
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send login request
      const response = await api.post("auth/login/", { email, password });

      // Extract data from the response
      const { access, refresh, role } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Store role in localStorage
      localStorage.setItem("role", role);

      // Fetch profile data after login
      await fetchProfileData();

      // Navigate based on the role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "seller") {
        navigate("/seller-analytics");
      } else {
        console.error("Unknown role, unable to navigate.");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/accounts/profiles/forgot_password/`,
        { email }
      );
      setForgotMessage("Password reset instructions sent to your email.");
    } catch (error) {
      setForgotMessage(
        error.response?.data?.detail || "Failed to send reset instructions."
      );
    }
  };

  const handleNavigateToSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <section id="body" className="login-container">
      <div className="login-form">
        <h2>Business Login</h2>
        <p>
          Don't have an account yet?{" "}
          <a onClick={handleNavigateToSignUp} style={{ cursor: "pointer" }}>
            Create Account
          </a>
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            Forgot your password?
          </a>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        {forgotMessage && <p className="forgot-message">{forgotMessage}</p>}
      </div>
    </section>
  );
}

export { Login, api };
