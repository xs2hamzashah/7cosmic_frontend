import React from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "../CSS/TermsAndConditions.css";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="terms-and-conditions">
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <IonIcon icon={arrowBackOutline} className="profile-back-icon" />
        Back
      </button>
      <h1>Welcome to 7Solar Web!</h1>
      <p>
        Please take a moment to read these Terms and Conditions carefully, as
        they form the agreement between you, as a user of 7Solar Web, and us,
        the provider of 7Solar Web services.
      </p>

      <h3>Sections of Most Attention</h3>
      <ul>
        <li>Agreement Overview</li>
        <li>Eligibility and Use of Service</li>
        <li>Privacy and Data Protection</li>
        <li>Subscription Plans</li>
        <ul>
          <li>Billing and Cancellation</li>
          <li>Payment Methods</li>
          <li>Auto-Renewal Policy</li>
        </ul>
        <li>Intellectual Property Rights</li>
        <li>Limitation of Liability</li>
        <li>Contact Us</li>
      </ul>

      <h3>1. Who We Are</h3>
      <p>
        7Solar Web (SMC-Private) Limited (“we,” “us,” or “our”) is a company
        registered in the Security Exchange Commission of Pakistan under THE
        COMPANIES ACT, 2017 (XIX of 2017), providing an online marketplace for
        solar energy solutions, packages, and services through our website,{" "}
        <a href="http://7solar.pk" target="_blank" rel="noopener noreferrer">
          7solar.pk
        </a>{" "}
        (the “Website”).
      </p>
      <p>
        Our mission is to connect customers with licensed solar companies
        offering advanced, cost-effective solar solutions.
      </p>

      <h3>2. Agreement Overview</h3>
      <p>
        By accessing and using 7Solar Web (“Service”), you agree to abide by
        these Terms and Conditions (the “Terms” or the “Agreement”), along with
        our Privacy Policy and any other terms referenced herein.
      </p>
      <p>
        If you do not agree to these Terms or are not eligible to use our
        Services, please refrain from accessing any part of the Service.
      </p>

      <h3>3. Eligibility and Use of Service</h3>
      <ul>
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

      <h3>4. What We Offer</h3>
      <ul>
        <li>A directory of licensed solar companies.</li>
        <li>Tools like the Solar Need Calculator and Solar Quote Maker.</li>
        <li>Access to solar energy packages and solutions.</li>
      </ul>

      <h3>5. Subscription Plans</h3>
      <h4>What We Offer</h4>
      <ul>
        <li>
          <strong>Free Listing:</strong> Basic access to the platform’s
          features.
        </li>
        <li>
          <strong>Premium Listing:</strong> Enhanced features and priority
          placement for solar companies (available through subscription).
        </li>
      </ul>

      <h4>i. Billing and Cancellation</h4>
      <ul>
        <li>
          Payments are processed through{" "}
          <a
            href="https://gopayfast.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go PayFast
          </a>{" "}
          or Bank Alfalah Payment Gateway or other payment providers.
        </li>
        <li>
          Subscriptions automatically renew unless canceled 24 hours before the
          end of the current billing period.
        </li>
      </ul>

      <h4>ii. Payment Methods</h4>
      <p>
        You authorize us to store your payment method and automatically charge
        subscription fees.
      </p>

      <h4>iii. Auto-Renewal Policy</h4>
      <p>
        The subscription period will auto-renew unless otherwise specified.
        Pricing changes will be communicated in advance.
      </p>

      <h3>6. Privacy and Data Protection</h3>
      <p>
        We collect and process user data in accordance with our{" "}
        <a href="#" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        . By using the Service, you consent to the collection, storage, and
        processing of your data as outlined in the policy.
      </p>

      <h3>7. Intellectual Property Rights</h3>
      <ul>
        <li>
          All content, trademarks, and materials available on 7Solar Web are the
          property of 7Solar Web (SMC-Private) Limited or its licensors.
        </li>
        <li>
          You may not reproduce, redistribute, or use any content without prior
          written permission.
        </li>
      </ul>

      <h3>8. Limitation of Liability</h3>
      <ul>
        <li>
          7Solar Web is not responsible for the accuracy or completeness of
          information provided by third-party solar companies.
        </li>
        <li>
          We are not liable for any damages resulting from the use or inability
          to use our services.
        </li>
      </ul>

      <h3>9. Third-Party Content and Links</h3>
      <p>
        Our platform may contain links to third-party websites or
        advertisements. We are not responsible for their content or services,
        and you use them at your own risk.
      </p>

      <h3>10. Compliance</h3>
      <p>
        Our services comply with the laws of Pakistan. Users outside of Pakistan
        are responsible for ensuring compliance with their local laws.
      </p>

      <h3>11. Contact Us</h3>
      <p>Email: ask@7solar.pk</p>
      <p>Phone: 0307-3171777</p>
    </div>
  );
};

export default TermsAndConditions;
