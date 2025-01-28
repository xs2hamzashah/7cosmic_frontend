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
  const [isSearchVisible, setSearchVisible] = useState(true);
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
    <nav className="max-w-7xl mx-auto flex justify-between items-center py-6 px-8">
      {/* Logo */}
      <h1 className="text-2xl font-semibold text-[#2ecc71] uppercase cursor-pointer">
        Logo
      </h1>

      {/* Search Form */}
      <div
        className={`flex-1 max-w-4xl mx-12 ${isSearchVisible ? "block" : "hidden md:block"}`}
      >
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2ecc71] outline-none transition-colors"
          />
          <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2ecc71] outline-none transition-colors">
            <option value="">City</option>
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
          </select>
          <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2ecc71] outline-none transition-colors">
            <option value="">Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
          </select>
          <button className="px-6 py-2 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Icons Section */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-[#2ecc71]"
          onClick={() => setSearchVisible(!isSearchVisible)}
        >
          <IonIcon icon={searchOutline} className="w-6 h-6" />
        </button>

        <button className="flex items-center justify-center w-10 h-10 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] transition-colors">
          <IonIcon icon={personOutline} className="w-6 h-6" />
        </button>

        <button className="flex items-center justify-center w-10 h-10 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] transition-colors">
          <IonIcon icon={logOutOutline} className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );

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
          onClick={() => setSearchVisible(!isSearchVisible)}
        />
      )}

      {/* Render the search box only if the user is on the homepage */}
      {location.pathname === "/" && (
        <div className={`search-box ${isSearchVisible ? "visible" : ""}`}>
          <SearchBox
            onSearch={onSearch}
            onClose={() => setSearchVisible(false)}
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
