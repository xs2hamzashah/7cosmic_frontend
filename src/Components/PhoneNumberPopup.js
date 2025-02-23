import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config";

const PhoneNumberPopup = ({ isOpen, onClose, id, sellerPhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const validatePakistaniNumber = (number) => {
    const cleanNumber = number.replace(/[\s-]/g, "");
    const pakistaniMobileRegex = /^03\d{9}$/;
    const pakistaniInternationalRegex = /^\+92\d{10}$/;
    return (
      pakistaniMobileRegex.test(cleanNumber) ||
      pakistaniInternationalRegex.test(cleanNumber)
    );
  };

  const formatToInternationalFormat = (number) => {
    const cleanNumber = number.replace(/[\s-]/g, "");
    if (cleanNumber.startsWith("03")) {
      return "+92" + cleanNumber.substring(1);
    }
    return cleanNumber;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const redirectToWhatsApp = (phoneNumber) => {
    const internationalNumber = formatToInternationalFormat(phoneNumber);
    const whatsappUrl = `https://wa.me/${internationalNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSendOtp = async () => {
    if (!validatePakistaniNumber(phoneNumber)) {
      setPhoneError(
        "Please enter a valid Pakistani mobile number (03XXXXXXXXX or +92XXXXXXXXXX)"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/operations/otp/send_otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );

      if (!response.ok) throw new Error("Failed to send OTP");

      const data = await response.json();
      setIsOtpSent(true);
      setTimer(60);
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    const payload = {
      phone_number: phoneNumber,
      otp_code: otp,
      solar_solution_id: id,
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

      const responseBody = await response.json();

      if (!response.ok) throw new Error("OTP verification failed");

      setPhoneNumber("");
      setOtp("");
      setIsOtpSent(false);
      onClose();

      if (sellerPhoneNumber) {
        redirectToWhatsApp(sellerPhoneNumber);
      } else {
        console.error("Seller phone number is missing");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
      <ToastContainer />
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
              disabled={isOtpSent || isLoading}
            />
            {phoneError && <p className="error-message">{phoneError}</p>}
            {isOtpSent && (
              <>
                <input
                  type="number"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  required
                  disabled={isLoading}
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
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded transition-all duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-[#ff6f20]"
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : isOtpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberPopup;
