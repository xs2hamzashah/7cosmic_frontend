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
// import "../CSS/ContactUsPage.css";

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
      <div className="contact-content flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-auto py-8 px-4">
        <div className="contact-info w-full md:w-1/2 text-lg text-gray-800 space-y-4">
          <h1 className="text-3xl font-bold text-[#ff6f20] mb-6">Contact Us</h1>
          <p className="flex items-center space-x-2">
            <IonIcon icon={logoFacebook} className="text-2xl text-blue-600" />
            <span>Facebook: </span>
            <a
              href="https://www.facebook.com/profile.php?id=61570871464248&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6f20] hover:underline"
            >
              Facebook Profile
            </a>
          </p>
          <p className="flex items-center space-x-2">
            <IonIcon icon={logoWhatsapp} className="text-2xl text-green-500" />
            <span>WhatsApp: </span>
            <a
              href="https://wa.me/923073171777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6f20] hover:underline"
            >
              +923073171777
            </a>
          </p>
          <p className="flex items-center space-x-2">
            <IonIcon icon={logoLinkedin} className="text-2xl text-blue-800" />
            <span>LinkedIn: </span>
            <a
              href="https://www.linkedin.com/company/7solar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6f20] hover:underline"
            >
              LinkedIn Profile
            </a>
          </p>
          <p className="flex items-center space-x-2">
            <IonIcon icon={logoYoutube} className="text-2xl text-red-600" />
            <span>YouTube: </span>
            <a
              href="https://youtube.com/@7solarweb?feature=shared"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6f20] hover:underline"
            >
              7Solar YouTube
            </a>
          </p>
        </div>
        <img
          src={contactUs}
          alt="Contact Us"
          className="contact-image w-full md:w-1/2 mt-6 md:mt-0 px-4"
        />
      </div>
    </div>
  );
};

export default ContactUsPage;
