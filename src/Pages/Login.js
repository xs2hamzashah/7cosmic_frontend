import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("auth/login/", { email, password });

      // Store access and refresh tokens
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      //   navigate(`/add-product/${userId}`);
      navigate(`/seller-analytics`);
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      setError("Invalid email or password");
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
          <a href="#">Forgot your password?</a>
          <input className="btn" type="submit" value="Sign In" />
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </section>
  );
}

export { Login, api };
