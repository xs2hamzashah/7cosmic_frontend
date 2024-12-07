import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Navbar.css";

export default function Navbar({ onSearch }) {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission
    const params = {
      city,
      size: size,
      price_range: priceRange,
      query: inputText,
    };
    onSearch(params); // Call the parent's search handler
  };

  const handleLogo = () => {
    if (location.pathname === "/") {
      // Reload the page if the user is already on the homepage
      window.location.reload();
    } else {
      // Otherwise, navigate to the homepage
      navigate("/");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <nav>
      <h2 className="logo" onClick={handleLogo}>
        logo
      </h2>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">City</option>
            <option value="ISB">Islamabad</option>
            <option value="KAR">Karachi</option>
            <option value="LHR">Lahore</option>
          </select>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Search..."
            className="search-bar"
          />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="middle-select"
          >
            <option value="">System size</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price range</option>
            <option value="below_1M">Below 1M</option>
            <option value="below_2M">Below 2M</option>
            <option value="below_3M">Below 3M</option>
            <option value="above_3M">Above 3M</option>
          </select>

          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      <p
        className="profile-icon"
        onClick={handleNavigateToLogin}
        style={{ cursor: "pointer" }}
      >
        <ion-icon name="person-outline"></ion-icon>
      </p>
    </nav>
  );
}
