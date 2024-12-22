import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SignUp.css";
import API_BASE_URL from "../config";
import CompanyNameInput from "../Components/CompanyNameInput";

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
  const [showTimer, setShowTimer] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
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
        const data = await response.json(); // testing
        console.log(data); // testing
        startTimer();
        setShowTimer(true);
        setIsOtpButtonDisabled(true);
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

    const payload = {
      phone_number: formData.phoneNumber,
      otp_code: otp,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/confirm_otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setOtpVerified(true);
        setShowTimer(false);
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

  const validateForm = () => {
    const newErrors = {};

    // Check for empty fields (excluding OTP-related fields)
    for (const key in formData) {
      if (formData[key] === "" && key !== "otp" && key !== "verifyOtp") {
        newErrors[key] = `Please fill out the ${key} field.`;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email =
        "Please enter a valid email address (e.g., example@domain.com).";
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Validate password strength and length
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain at least one capital letter, and one number.";
    }

    if (!otpVerified) {
      newErrors.otp = "Please verify OTP before signing up.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Stop form submission if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
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
      if (countdown <= 0) {
        clearInterval(interval);
        setIsOtpButtonDisabled(false); // Re-enable "Send OTP" button
        setShowTimer(false); // Hide timer
      }
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
        {errors.form && <div className="error-message">{errors.form}</div>}
        <div className="inputs-section">
          <div className="right-side">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <CompanyNameInput
              value={formData.companyName}
              onChange={(newValue) =>
                setFormData({ ...formData, companyName: newValue })
              }
            />
            {errors.companyName && (
              <span className="error-message">{errors.companyName}</span>
            )}
            <input
              type="text"
              className="otp"
              placeholder="WhatsApp Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <span className="error-message">{errors.phoneNumber}</span>
            )}
            <input
              type="text"
              className="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && <span className="error-message">{errors.otp}</span>}
            <div className="side-otp-buttons">
              <button
                type="button"
                className="ghost-otp"
                style={{
                  marginBottom:
                    errors.phoneNumber || errors.otp ? "43px" : "10px",
                }}
                onClick={handleSendOtp}
                disabled={isOtpButtonDisabled}
              >
                Send OTP
              </button>
              <button
                type="button"
                className="ghost-otp"
                style={{
                  marginBottom:
                    errors.phoneNumber || errors.otp ? "25px" : "0px",
                }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>

          <div className="left-side">
            <select name="city" value={formData.city} onChange={handleChange}>
              <option value="">Select City</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
            </select>
            {errors.city && <div className="error-message">{errors.city}</div>}
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <div className="otp-timer">
          {showTimer && ( // Conditionally show timer
            <div>
              <p>
                Time remaining:{" "}
                {timer > 0
                  ? `00:${timer.toString().padStart(2, "0")}`
                  : "Expired"}
              </p>
              {timer === 0 && (
                <a onClick={handleSendOtp} style={{ cursor: "pointer" }}>
                  Resend OTP
                </a>
              )}
            </div>
          )}
          <button type="submit">Create</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </section>
  );
}

export default SignupForm;
