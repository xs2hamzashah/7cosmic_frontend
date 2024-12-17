import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotMessage, setForgotMessage] = useState(""); // For forgot password feedback
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Determine the role based on email and password
      let role = "seller"; // Default role
      if (email === "admin@example.com" && password === "useradmin") {
        role = "admin";
      }

      // Send login request with email, password, and role
      const response = await api.post("auth/login/", { email, password, role });
      const { access, refresh } = response.data;

      // Store tokens in local storage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Navigate to the correct dashboard based on the role
      if (role === "admin") {
        try {
          // Verify admin access
          const adminResponse = await api.get(
            "/listings/analytics/admin_analytics/"
          );
          if (adminResponse.data) {
            navigate("/admin");
            return;
          }
        } catch (error) {
          setError("Admin access failed.");
          return;
        }
      } else {
        try {
          // Verify seller access
          const sellerResponse = await api.get(
            "/listings/analytics/seller_analytics/"
          );
          if (sellerResponse.data && sellerResponse.data.seller_id) {
            const sellerId = sellerResponse.data.seller_id;

            // Store seller ID in local storage for future use
            localStorage.setItem("sellerId", sellerId);

            // Navigate to seller analytics page
            navigate(`/seller-analytics/${sellerId}`);
            return;
          }
        } catch (error) {
          setError("Seller access failed.");
          return;
        }
      }

      // If neither role works, show error
      setError("You do not have permission to access this data.");
    } catch (error) {
      // Handle login failure
      setError(error.response?.data?.detail || "Invalid email or password");
    }
  };

  // ============== handle forget password ================ //
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/profiles/forgot_password/",
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
    <section className="login-container">
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
          <input className="btn" type="submit" value="Sign In" />
        </form>
        {error && <p className="login-error">{error}</p>}
        {forgotMessage && <p className="forgot-message">{forgotMessage}</p>}
      </div>
    </section>
  );
}

export { Login, api };
