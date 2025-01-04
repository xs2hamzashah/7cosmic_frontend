import React, { createContext, useState, useEffect } from "react";
import API_BASE_URL from "../config";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(() => {
    // Initialize state from localStorage if available
    const storedData = localStorage.getItem("profileData");
    return storedData ? JSON.parse(storedData) : null;
  });
  const [loading, setLoading] = useState(!profileData); // Skip loading if data is already available

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/accounts/profiles/my_profile/?role=seller`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        localStorage.setItem("profileData", JSON.stringify(data)); // Store data in localStorage
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !profileData) {
      fetchProfileData(); // Fetch only if no profile data is stored
    }
  }, [profileData]);

  const clearProfileData = () => {
    // Function to clear profile data from state and localStorage
    setProfileData(null);
    localStorage.removeItem("profileData");
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, loading, fetchProfileData, clearProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext };
