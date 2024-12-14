import React from "react";
import "../CSS/SubscriptionPopup.css"; // Make sure you create a CSS file for styling.
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const SubscriptionPopup = ({ onSubscribe, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-icon" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </button>
        <h2 className="popup-title">Unlock Premium Features</h2>
        <p className="popup-description">
          Join our Basic Subscription plan for just <strong>$50 per month</strong> and enjoy the following benefits:
        </p>
        <ul className="popup-benefits">
          <li>✔ Access up to <strong>50 exclusive leads</strong> every month.</li>
          <li>✔ Showcase up to <strong>3 packages</strong> to potential buyers.</li>
          <li>✔ Boost visibility and maximize your outreach.</li>
          <li>✔ Priority customer support for subscribers.</li>
        </ul>
        <p className="popup-footer-text">
          Don't miss this opportunity to grow your business! Subscribe now and take your sales to the next level.
        </p>
        <div className="popup-buttons">
          <button onClick={onSubscribe} className="subscribe-button">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
