import React from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  return (
    <div className="p-6 bg-white text-gray-800">
      {/* Header Section */}
      <div className="relative flex items-center justify-center mb-6">
        {isLoggedIn && (
          <button
            className="absolute left-0 flex items-center gap-2 px-4 py-2 text-white bg-[#ff6f20] hover:bg-[#e65f1a] rounded shadow"
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            <IonIcon icon={arrowBackOutline} className="text-lg" />
            Back
          </button>
        )}
        <h1 className="text-4xl font-bold text-[#ff6f20]">
          Welcome to 7Solar Web!
        </h1>
      </div>
      <p className="mb-4">
        Please take a moment to read these Terms and Conditions carefully, as
        they form the agreement between you, as a user of 7Solar Web, and us,
        the provider of 7Solar Web services.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2">
        Sections of Most Attention
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Agreement Overview</li>
        <li>Eligibility and Use of Service</li>
        <li>Privacy and Data Protection</li>
        <li>
          Subscription Plans
          <ul className="list-disc list-inside ml-6">
            <li>Billing and Cancellation</li>
            <li>Payment Methods</li>
            <li>Auto-Renewal Policy</li>
          </ul>
        </li>
        <li>Intellectual Property Rights</li>
        <li>Limitation of Liability</li>
        <li>Contact Us</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-2">1. Who We Are</h3>
      <p className="mb-4">
        7Solar Web (SMC-Private) Limited (“we,” “us,” or “our”) is a company
        registered in the Security Exchange Commission of Pakistan under THE
        COMPANIES ACT, 2017 (XIX of 2017), providing an online marketplace for
        solar energy solutions, packages, and services through our website,{" "}
        <a
          href="http://7solar.pk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff6f20] hover:underline"
        >
          7solar.pk
        </a>{" "}
        (the “Website”).
      </p>
      <p className="mb-4">
        Our mission is to connect customers with licensed solar companies
        offering advanced, cost-effective solar solutions.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2">
        2. Agreement Overview
      </h3>
      <p className="mb-4">
        By accessing and using 7Solar Web (“Service”), you agree to abide by
        these Terms and Conditions (the “Terms” or the “Agreement”), along with
        our Privacy Policy and any other terms referenced herein.
      </p>
      <p className="mb-4">
        If you do not agree to these Terms or are not eligible to use our
        Services, please refrain from accessing any part of the Service.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2">
        3. Eligibility and Use of Service
      </h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          To use 7Solar Web, you must be at least 18 years old and have the
          legal capacity to enter into an agreement.
        </li>
        <li>
          You are responsible for providing accurate information during
          registration.
        </li>
        <li>
          Use of the Service for illegal or unauthorized purposes is strictly
          prohibited.
        </li>
      </ul>

      {/* Additional content styled similarly */}
      <h3 className="text-2xl font-semibold mt-6 mb-2">11. Contact Us</h3>
      <p className="mb-2">Email: ask@7solar.pk</p>
      <p>Phone: 0307-3171777</p>
    </div>
  );
};

export default TermsAndConditions;
