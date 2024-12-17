import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SignUp.css";
import API_BASE_URL from "../config";

function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(59);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/send_otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: formData.phoneNumber }),
        }
      );
      if (response.ok) {
        startTimer();
        alert("OTP sent successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/confirm_otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: formData.phoneNumber, otp }),
        }
      );
      if (response.ok) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify OTP before signing up.");
      return;
    }

    const signupData = {
      user: {
        email: formData.email,
        full_name: formData.companyName,
        username: formData.username,
        phone_number: formData.phoneNumber,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      },
      role: "seller",
      company: {
        name: formData.companyName,
        phone_number: formData.phoneNumber,
        city: formData.city,
        description: "string",
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/profiles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login"); // Navigate to the dashboard
      } else {
        const errorData = await response.json();
        console.error("Failed to create account", errorData);
        alert(`Error: ${errorData.message || "Check your input fields"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  const startTimer = () => {
    let countdown = 59;
    setTimer(countdown);
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) clearInterval(interval);
    }, 1000);
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="signup-section">
      <h1>Create Business Account</h1>
      <p>
        Already have an account?
        <a onClick={handleNavigateToLogin} style={{ cursor: "pointer" }}>
          Log in
        </a>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="inputs-section">
          <div className="right-side">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <input
              type="text"
              className="otp"
              placeholder="WhatsApp Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              className="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="side-otp-buttons">
              <button
                type="button"
                className="ghost-otp"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
              <button
                type="button"
                className="ghost-otp"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>

          <div className="left-side">
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="otp-timer">
          <p>
            Time remaining:{" "}
            {timer > 0 ? `00:${timer.toString().padStart(2, "0")}` : "Expired"}
          </p>
          {timer === 0 && (
            <a onClick={handleSendOtp} style={{ cursor: "pointer" }}>
              Resend OTP
            </a>
          )}
          <button type="submit">Create</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </section>
  );
}

export default SignupForm;
