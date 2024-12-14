import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { clipboardOutline, logOutOutline, personOutline } from "ionicons/icons";
import "../CSS/Navbar.css";

export default function Navbar({ onSearch }) {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const sellerId = localStorage.getItem("sellerId"); // Retrieve seller ID
    if (token && sellerId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Run only once on component mount

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {
      city,
      size,
      price_range: priceRange,
      query: inputText,
    };
    onSearch(params);
  };

  const handleLogo = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    // Remove token and seller ID from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sellerId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav>
      <h2 className="logo" onClick={handleLogo}>
        logo
      </h2>

      {/* Render the search box only if the user is on the homepage */}
      {location.pathname === "/" && (
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
      )}

      <div className="icon-section">
        {!isLoggedIn ? (
          <p
            className="profile-icon"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            <IonIcon icon={personOutline} />
          </p>
        ) : (
          <>
            <p
              className="clipboard"
              onClick={() => {
                const sellerId = localStorage.getItem("sellerId");
                if (sellerId) {
                  navigate(`/seller-analytics/${sellerId}`);
                } else {
                  console.error("Seller ID is missing.");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <IonIcon icon={clipboardOutline} />
            </p>
            <p
              className="log-out"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <IonIcon icon={logOutOutline} />
            </p>
          </>
        )}
      </div>
    </nav>
  );
}
