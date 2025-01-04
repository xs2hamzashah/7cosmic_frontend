import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../context/ProfileContext"; // Import the ProfileContext
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  businessOutline,
  mailOutline,
  callOutline,
  locationOutline,
  arrowBackOutline,
} from "ionicons/icons";
import profileImage from "../assets/profile.svg";
import "../CSS/ProfilePage.css"; // Import CSS file

const ProfilePage = () => {
  const { profileData, loading } = useContext(ProfileContext);
  const [isLoading, setIsLoading] = useState(true); // Local loading state for the profile page
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setIsLoading(false); // Once loading is done, set the local loading state to false
    }
  }, [loading]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div>
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <IonIcon icon={arrowBackOutline} className="profile-back-icon" />
        Back
      </button>
      <div className="profile-page">
        {/* Left Section - Image */}
        <div className="profile-text-section">
          <h1 className="profile-heading">Profile</h1>

          <p className="profile-detail">
            <IonIcon icon={businessOutline} className="profile-page-icon" />
            <strong>Company Name:</strong> {profileData.company.name}
          </p>

          <p className="profile-detail">
            <IonIcon icon={mailOutline} className="profile-page-icon" />
            <strong>Email:</strong> {profileData.user.email}
          </p>

          <p className="profile-detail">
            <IonIcon icon={callOutline} className="profile-page-icon" />
            <strong>Phone Number:</strong> {profileData.user.phone_number}
          </p>

          <p className="profile-detail">
            <IonIcon icon={locationOutline} className="profile-page-icon" />
            <strong>City:</strong> {profileData.company.city}
          </p>

          <button
            onClick={() => navigate("/seller-analytics")}
            className="profile-dashboard-button"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Right Section - Text */}

        <div className="profile-image-section">
          <img src={profileImage} alt="Profile" className="profile-image" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
