import React, { useState } from "react";
import "../CSS/ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password submitted:", password);
    // Add API integration here if needed
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="password-input"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
