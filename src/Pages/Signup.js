import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/profiles/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );
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

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="signup-section">
      <h1>Create Business Account</h1>
      <p>
        Already have an account?{" "}
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
              type="number"
              className="otp"
              placeholder="WhatsApp Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <input type="number" className="otp" placeholder="OTP" disabled />
            <div className="side-otp-buttons">
              <input type="submit" className="ghost-otp" value="OTP" disabled />
              <input
                type="submit"
                className="ghost-otp"
                value="Verify"
                disabled
              />
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
          <p>Time remaining 00:59</p>
          <a href="#">Resend OTP</a>
          <button type="submit">Create</button>
        </div>
      </form>
    </section>
  );
}

export default SignupForm;
