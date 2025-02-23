import React from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Logo from "../assets/logo.svg";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  return (
    <div className="p-6">
      <div className="flex justify-center">
        <img src={Logo} alt="Profile" className="profile-image w-[300px]" />
      </div>
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
      <div className="bg-[#ffffff] p-6 px-20">
        <h2 className="text-3xl font-bold text-center mb-6">
          Terms and Conditions
        </h2>

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
          these Terms and Conditions (the “Terms” or the “Agreement”), along
          with our Privacy Policy and any other terms referenced herein.
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

        <h3 className="text-2xl font-semibold mt-6 mb-2">4. What We Offer</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>A directory of licensed solar companies.</li>
          <li>Tools like the Solar Need Calculator and Solar Quote Maker.</li>
          <li>Access to solar energy packages and solutions.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          5. Subscription Plans
        </h3>
        <h4 className="text-xl font-semibold mt-4 mb-2">What We Offer</h4>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Free Listing: Basic access to the platform's features.</li>
          <li>
            Premium Listing: Enhanced features and priority placement for solar
            companies (available through subscription).
          </li>
        </ul>

        <h4 className="text-xl font-semibold mt-4 mb-2">
          i. Billing and Cancellation
        </h4>
        <p className="mb-4">
          Payments are processed through Go PayFast or Bank Alfalah Payment
          Gateway or other payment providers.
        </p>
        <p className="mb-4">
          Subscriptions automatically renew unless canceled 24 hours before the
          end of the current billing period.
        </p>

        <h4 className="text-xl font-semibold mt-4 mb-2">ii. Payment Methods</h4>
        <p className="mb-4">
          You authorize us to store your payment method and automatically charge
          subscription fees.
        </p>

        <h4 className="text-xl font-semibold mt-4 mb-2">
          iii. Auto-Renewal Policy
        </h4>
        <p className="mb-4">
          The subscription period will auto-renew unless otherwise specified.
          Pricing changes will be communicated in advance.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          6. Privacy and Data Protection
        </h3>
        <p className="mb-4">
          We collect and process user data in accordance with our Privacy
          Policy. By using the Service, you consent to the collection, storage,
          and processing of your data as outlined in the policy.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          7. Intellectual Property Rights
        </h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            All content, trademarks, and materials available on 7Solar Web are
            the property of 7Solar Web (SMC-Private) Limited or its licensors.
          </li>
          <li>
            You may not reproduce, redistribute, or use any content without
            prior written permission.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          8. Limitation of Liability
        </h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            7Solar Web is not responsible for the accuracy or completeness of
            information provided by third-party solar companies.
          </li>
          <li>
            We are not liable for any damages resulting from the use or
            inability to use our services.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          9. Third-Party Content and Links
        </h3>
        <p className="mb-4">
          Our platform may contain links to third-party websites or
          advertisements. We are not responsible for their content or services,
          and you use them at your own risk.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">10. Compliance</h3>
        <p className="mb-4">
          Our services comply with the laws of Pakistan. Users outside of
          Pakistan are responsible for ensuring compliance with their local
          laws.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">11. Contact Us</h3>
        <p className="mb-2">Email: ask@7solar.pk</p>
        <p>Phone: 0307-3171777</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
