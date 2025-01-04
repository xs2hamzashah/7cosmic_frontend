import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  searchOutline,
  clipboardOutline,
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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Controls dropdown visibility
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const sellerId = localStorage.getItem("sellerId");
    if (token && sellerId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
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

      {!location.pathname.startsWith("/product-detail") && (
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
            <div className="dropdown">
              <IonIcon
                icon={personOutline}
                className="dropdown-toggle"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                style={{ cursor: "pointer" }}
              />
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span>{companyName}</span>
              )}
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  {/* Close Button */}
                  <div
                    className="dropdown-header"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <p
                      className="dropdown-item-text"
                      style={{
                        fontSize: "18px",
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
                  {/* Profile Link */}
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
                  {/* Dashboard Link */}
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
                  {/* Subscription Link */}
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
                  {/* Terms and Conditions */}
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
                  {/* Contact Us */}
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
                  {/* Logout */}
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
