// PhoneNumberPopup.js
import React, { useState } from "react";

const PhoneNumberPopup = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the phone number submission logic here
    console.log("Phone Number Submitted:", phoneNumber);
    // Optionally clear the input
    setPhoneNumber("");
    onClose(); // Close the popup after submission
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
            onChange={handleInputChange}
            placeholder="03XXXXXXXXX"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberPopup;
