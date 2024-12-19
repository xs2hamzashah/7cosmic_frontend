import React, { useState, useEffect } from "react";

const PhoneNumberPopup = ({ isOpen, onClose, id }) => {
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

  const handleSendOtp = async () => {
    try {
      const response = await fetch(
        "https://cosmic-server7.onrender.com/api/operations/otp/send_otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );

      if (!response.ok) throw new Error("Failed to send OTP");

      console.log("OTP sent to:", phoneNumber);
      const data = await response.json(); // Assuming the response includes the OTP message
      console.log(data);
      setIsOtpSent(true);
      setTimer(60); // Reset the timer
    } catch (error) {
      alert("Error sending OTP. Please try again.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    const payload = {
      phone_number: phoneNumber,
      otp_code: otp,
      solar_solution_id: id, // Use the id from props
    };

    console.log("Payload being sent:", payload); // Log the payload

    try {
      const response = await fetch(
        "https://cosmic-server7.onrender.com/api/operations/otp/confirm_otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Send the payload as JSON
        }
      );

      const responseBody = await response.json();
      console.log("Full response body:", responseBody); // Log the full response

      if (!response.ok) throw new Error("OTP verification failed");

      console.log("OTP verified!");
      setPhoneNumber("");
      setOtp("");
      setIsOtpSent(false);
      onClose();
    } catch (error) {
      alert("Invalid OTP. Please try again.");
      console.error("Error:", error);
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
    <div className="popup-phone-number-overlay">
      <div className="popup-phone-number-content">
        <p onClick={onClose} className="close-button">
          X
        </p>
        <div>
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
                <div className="product-otp-timer">
                  <p>
                    {timer > 0
                      ? `Time remaining: ${String(timer).padStart(2, "0")}s`
                      : "OTP expired!"}
                  </p>
                  {timer === 0 && <a onClick={handleResendOtp}>Resend OTP</a>}
                </div>
              </>
            )}
            <button type="submit">
              {isOtpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberPopup;
