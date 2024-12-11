import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config";

const PhoneNumberPopup = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      // API call to send OTP
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/send_otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send OTP");
      }

      const responseData = await response.json();
      console.log("OTP Response Data:", responseData);

      if (Array.isArray(responseData) && responseData.length > 0) {
        console.log("OTP Message:", responseData[0]);
      }
      console.log("OTP sent successfully");
      setIsOtpSent(true);
      setTimer(60); // Reset the timer
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      // API call to verify OTP
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/confirm_otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phoneNumber, otp_code: otp }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid OTP");
      }

      console.log("OTP Verified Successfully!");
      setPhoneNumber("");
      setOtp("");
      setIsOtpSent(false);
      onClose(); // Close the popup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p onClick={onClose} className="close-button">
          X
        </p>
        <h2>{isOtpSent ? "Verify OTP" : "Enter Your Phone Number"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="03XXXXXXXXX"
            required
            disabled={isOtpSent} // Disable input after OTP is sent
          />
          {isOtpSent && (
            <>
              <input
                type="number"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                required
              />
              <div>
                <p>
                  {timer > 0
                    ? `Time remaining: ${String(timer).padStart(2, "0")}s`
                    : "OTP expired!"}
                </p>
                {timer === 0 && (
                  <button type="button" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberPopup;
