import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  searchOutline,
  clipboardOutline,
  logOutOutline,
  personOutline,
} from "ionicons/icons";
import "../CSS/Navbar.css";
import SearchBox from "./SearchBox";

export default function Navbar({ onSearch }) {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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

      {/* Search icon for smaller screens */}
      {location.pathname === "/" && (
        <IonIcon
          icon={searchOutline}
          className="search-icon"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        />
      )}

      {/* Render the search box only if the user is on the homepage */}
      {location.pathname === "/" && (
        <div className={`search-box ${isSearchVisible ? "visible" : ""}`}>
          <SearchBox
            onSearch={onSearch}
            onClose={() => setIsSearchVisible(false)}
          />
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
            {!location.pathname.startsWith("/seller-analytics") && (
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
            )}
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
