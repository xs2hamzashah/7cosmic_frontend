import React, { useState, useEffect } from "react";

const PhoneNumberPopup = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);

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

  const handleSendOtp = () => {
    // Simulate sending OTP
    console.log("Sending OTP to:", phoneNumber);
    setIsOtpSent(true);
    setTimer(60); // Reset the timer
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    if (otp === "1234") {
      console.log("OTP Verified!");
      setPhoneNumber("");
      setOtp("");
      setIsOtpSent(false);
      onClose();
    } else {
      alert("Invalid OTP. Please try again.");
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
        <h2>Enter Your Phone Number</h2>
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
              <div className="otp-timer">
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
          <button type="submit">
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberPopup;
