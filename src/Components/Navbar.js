import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  searchOutline,
  clipboardOutline,
  logInOutline,
  logOutOutline,
  personOutline,
  documentOutline,
  callOutline,
  starOutline,
  closeOutline,
} from "ionicons/icons";
import "../CSS/Navbar.css";
import SearchBox from "./SearchBox";

export default function Navbar({
  onSearch,
  companyName,
  sellerEmail,
  loading,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const sellerId = localStorage.getItem("sellerId");
    setIsLoggedIn(!!(token && sellerId));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogo = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
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

      {location.pathname === "/" && (
        <>
          <IonIcon
            icon={searchOutline}
            className="search-icon"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          />
          <div className={`search-box ${isSearchVisible ? "visible" : ""}`}>
            <SearchBox
              onSearch={onSearch}
              onClose={() => setIsSearchVisible(false)}
            />
          </div>
        </>
      )}

      {!location.pathname.startsWith("/product-detail") && (
        <div className="icon-section">
          {!isLoggedIn ? (
            <p
              className="profile-icon"
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              <IonIcon icon={logInOutline} />
            </p>
          ) : (
            <div className="dropdown" ref={dropdownRef}>
              <IonIcon
                icon={personOutline}
                className="dropdown-toggle"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                style={{ cursor: "pointer" }}
              />
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {companyName}
                </span>
              )}
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-header"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <p
                      className="dropdown-item-text"
                      style={{
                        fontSize: "20px",
                        marginRight: "auto",
                        margin: "20px",
                      }}
                    >
                      {companyName}
                    </p>
                    <button
                      className="close-button"
                      onClick={() => setIsDropdownVisible(false)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: "4px",
                        fontSize: "31px",
                      }}
                    >
                      <IonIcon icon={closeOutline} />
                    </button>
                  </div>
                  <p className="dropdown-item" style={{ fontSize: "16px" }}>
                    {sellerEmail}
                  </p>
                  <p
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownVisible(false);
                    }}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <IonIcon icon={personOutline} /> Profile
                  </p>
                  {location.pathname !== "/seller-analytics" && (
                    <p
                      className="dropdown-item"
                      onClick={() => {
                        const sellerId = localStorage.getItem("sellerId");
                        if (sellerId) {
                          navigate(`/seller-analytics`);
                        } else {
                          console.error("Seller ID is missing.");
                        }
                        setIsDropdownVisible(false);
                      }}
                      style={{ cursor: "pointer", fontSize: "16px" }}
                    >
                      <IonIcon icon={clipboardOutline} /> Dashboard
                    </p>
                  )}
                  <p
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/subscription-page");
                      setIsDropdownVisible(false);
                    }}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <IonIcon icon={starOutline} /> Subscription
                  </p>
                  <p
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/terms-and-conditions");
                      setIsDropdownVisible(false);
                    }}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <IonIcon icon={documentOutline} /> Terms and Conditions
                  </p>
                  <p
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/contact-us");
                      setIsDropdownVisible(false);
                    }}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <IonIcon icon={callOutline} /> Contact Us
                  </p>
                  <p
                    className="dropdown-item"
                    onClick={handleLogout}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <IonIcon icon={logOutOutline} /> Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
