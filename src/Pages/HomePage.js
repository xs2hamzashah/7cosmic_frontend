import React, { useState, useEffect, useContext } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import { ProfileContext } from "../context/ProfileContext"; // Correct import
import API_BASE_URL from "../config";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isFilteredView, setIsFilteredView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");

  const {
    profileData,
    loading: profileLoading,
    fetchProfileData,
  } = useContext(ProfileContext); // Correctly access context

  const fetchPackages = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/`
      );
      const data = await response.json();
      setPackages(data.results); // Store all packages
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSearch = async (searchParams) => {
    const { city, size, price_range, query } = searchParams;

    setLoading(true); // Start loading
    try {
      const queryString = new URLSearchParams({
        ...(city && { city }),
        ...(size && { size }),
        ...(price_range && { price: price_range }),
        ...(query && { display_name: query }),
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/?${queryString}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filtered data");
      }

      const data = await response.json();
      setFilteredPackages(data); // Update filtered packages with API response
      setIsFilteredView(true); // Switch to filtered view
    } catch (error) {
      console.error("Error fetching filtered packages:", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  const goBackToHomePage = () => {
    setIsFilteredView(false); // Switch back to homepage view
  };

  // Debugging: Log profile data to the console
  useEffect(() => {
    if (profileData && profileData.company && profileData.user) {
      setCompanyName(profileData.company.name); // Only set if profileData is available
      setSellerEmail(profileData.user.email); // Only set if profileData is available
    }
  }, [profileData]);

  return (
    <section>
      <Navbar
        onSearch={handleSearch}
        companyName={companyName}
        sellerEmail={sellerEmail}
        loading={profileLoading} // Pass loading status from context
      />
      {/* Render loading animation if profile is still being fetched */}
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : isFilteredView ? (
        <section className="filtered-section">
          <h1>Search Results</h1>
          <button onClick={goBackToHomePage} className="back-button">
            <IonIcon icon={arrowBackOutline} className="back-icon" /> Back to
            home
          </button>
          <PackagesList packages={filteredPackages} />
        </section>
      ) : (
        <>
          <HeroSection />
          <div className="calculator">
            <button className="ghost">Solar Need Calculator</button>
          </div>
          <section className="card-section">
            <h1>Featured Listing</h1>
            <PackagesList packages={packages} />
          </section>
        </>
      )}
    </section>
  );
}
