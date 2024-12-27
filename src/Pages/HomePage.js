import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isFilteredView, setIsFilteredView] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchPackages = async () => {
    try {
      const response = await fetch(
        "https://cosmic-server7.onrender.com/api/listings/solar-solutions/"
      );
      const data = await response.json();
      setPackages(data); // Store all packages
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
        `https://cosmic-server7.onrender.com/api/listings/solar-solutions/?${queryString}`
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

  return (
    <section>
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div> {/* Loading animation */}
        </div>
      ) : isFilteredView ? (
        <section className="filtered-section">
          <h1>Search Results</h1>
          <button onClick={goBackToHomePage} className="back-button">
            <IonIcon icon={arrowBackOutline} className="back-icon" /> Back to
            Home
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
