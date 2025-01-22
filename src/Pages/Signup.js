import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/SignUp.css";
import API_BASE_URL from "../config";
import CompanyNameInput from "../Components/CompanyNameInput";
import Navbar from "../Components/Navbar";

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
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(true);
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Validate phone number
  const isValidPhoneNumber = (phoneNumber) => {
    // Remove any spaces, hyphens, or parentheses from the number
    const cleanedNumber = phoneNumber.replace(/[\s\-()]/g, "");

    // Allow:
    // - Optional + at the start
    // - Followed by 8-15 digits (most international numbers fall in this range)
    const phoneRegex = /^\+?[0-9]{8,15}$/;

    return phoneRegex.test(cleanedNumber);
  };

  // Handle phone number and other form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Enable/disable Send OTP button based on phone number validation
    if (name === "phoneNumber") {
      setIsOtpButtonDisabled(!isValidPhoneNumber(value));
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    // Enable verify button only if OTP is entered and OTP was sent
    setIsVerifyButtonDisabled(!(value.length > 0 && otpSent));
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
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
        const data = await response.json();
        startTimer();
        setShowTimer(true);
        setIsOtpButtonDisabled(true);
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send OTP.");
        toast.error(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
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
        setIsVerifyButtonDisabled(true);
        toast.success("OTP verified successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to verify OTP.");
        toast.error(errorData.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions to proceed.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
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
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Failed to create account", errorData);
        toast.error(`Error: ${errorData.message || "Check your input fields"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
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
        setIsOtpButtonDisabled(false);
      }
    }, 1000);
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section>
      <Navbar />
      <ToastContainer />
      <div className="signup-section">
        <h1>Create Business Account</h1>
        <p>
          Already have an account?{" "}
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
              <div className="otp-container">
                <div className="input-button-pair">
                  <input
                    type="text"
                    className="otp"
                    placeholder="WhatsApp Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={`ghost-otp ${
                      isOtpButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSendOtp}
                    disabled={isOtpButtonDisabled || loading}
                  >
                    Send OTP
                  </button>
                </div>
                {errors.phoneNumber && (
                  <span className="error-message">{errors.phoneNumber}</span>
                )}
                <div className="input-button-pair">
                  <input
                    type="text"
                    className="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={!otpSent}
                  />
                  <button
                    type="button"
                    className={`ghost-otp ${
                      isVerifyButtonDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleVerifyOtp}
                    disabled={isVerifyButtonDisabled || loading}
                  >
                    Verify OTP
                  </button>
                </div>
                {errors.otp && (
                  <span className="error-message">{errors.otp}</span>
                )}
              </div>
            </div>

            <div className="left-side">
              <select name="city" value={formData.city} onChange={handleChange}>
                <option value="">Select City</option>
                <option value="ISB">Islamabad</option>
                <option value="KAR">Karachi</option>
                <option value="LHR">Lahore</option>
              </select>
              {errors.city && (
                <div className="error-message">{errors.city}</div>
              )}
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

          <div className="otp-timer w-full max-w-md mx-auto flex flex-col items-center p-4">
            <div className="terms-section flex items-center gap-2 mt-2 w-full justify-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
                className="w-4 h-4 accent-orange-500 border-gray-400 cursor-pointer"
              />
              <label className="text-sm text-gray-800">
                I agree to the{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 no-underline hover:underline"
                >
                  terms and conditions
                </a>
              </label>
              {errors.terms && (
                <span className="text-xs text-red-500 ml-2">
                  {errors.terms}
                </span>
              )}
            </div>

            <div className="w-full flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full max-w-xs rounded-lg bg-orange-500 text-white text-sm font-medium uppercase py-3 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
              >
                {loading ? "Processing..." : "Create"}
              </button>
            </div>

            {showTimer && (
              <div className="flex items-center justify-center my-1 w-full">
                <p className="text-sm">
                  Time remaining:{" "}
                  {timer > 0
                    ? `00:${timer.toString().padStart(2, "0")}`
                    : "Expired"}
                </p>
                {timer === 0 && (
                  <a
                    onClick={handleSendOtp}
                    className="text-orange-500 cursor-pointer hover:underline ml-2"
                  >
                    Resend OTP
                  </a>
                )}
              </div>
            )}
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </section>
  );
}

export default SignupForm;
