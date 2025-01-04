import React from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoWhatsapp,
  logoLinkedin,
  logoYoutube,
  arrowBackOutline,
} from "ionicons/icons";

import contactUs from "../assets/contact-us.svg";
import "../CSS/ContactUsPage.css";

const ContactUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="contact-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <IonIcon icon={arrowBackOutline} className="back-icon" />
        Back
      </button>
      <div className="contact-content">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            <IonIcon icon={logoFacebook} className="facebook-icon" />
            Facebook:{" "}
            <a
              href="https://www.facebook.com/profile.php?id=61570871464248&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Profile
            </a>
          </p>
          <p>
            <IonIcon icon={logoWhatsapp} className="whatsapp-icon" />
            WhatsApp:{" "}
            <a
              href="https://wa.me/923073171777"
              target="_blank"
              rel="noopener noreferrer"
            >
              +923073171777
            </a>
          </p>
          <p>
            <IonIcon icon={logoLinkedin} className="linkedin-icon" />
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/company/7solar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </p>
          <p>
            <IonIcon icon={logoYoutube} className="youtube-icon" />
            YouTube:{" "}
            <a
              href="https://youtube.com/@7solarweb?feature=shared"
              target="_blank"
              rel="noopener noreferrer"
            >
              7Solar YouTube
            </a>
          </p>
        </div>
        <img src={contactUs} alt="Contact Us" className="contact-image" />
      </div>
    </div>
  );
};

export default ContactUsPage;
