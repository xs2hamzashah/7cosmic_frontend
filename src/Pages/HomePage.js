import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import { API_URL } from "../api/request";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isFilteredView, setIsFilteredView] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/listings/solar-solutions/`);
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
        ...(query && { search: query }),
      }).toString();

      const response = await fetch(
        `${API_URL}/listings/solar-solutions/?${queryString}`
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
    <div className="min-h-screen bg-white">
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-[#2ecc71] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">
            Finding the best solar solutions for you...
          </p>
        </div>
      ) : isFilteredView ? (
        <section className="container mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            <button
              onClick={goBackToHomePage}
              className="flex items-center gap-2 px-4 py-2 text-[#2ecc71] hover:text-[#27ae60] transition-colors"
            >
              <IonIcon icon={arrowBackOutline} className="w-5 h-5" />
              Back to Home
            </button>
          </div>
          <PackagesList packages={filteredPackages} />
        </section>
      ) : (
        <>
          <HeroSection />
          <section className="container mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Listings
              </h1>
              <p className="text-gray-600">
                Discover our top-rated solar packages
              </p>
            </div>
            <PackagesList packages={packages} />
          </section>
        </>
      )}
    </div>
  );

  return (
    <div className="homepage-container">
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="loading-container">
          <div className="pulse-loader"></div>
          <p>Finding the best solar solutions for you...</p>
        </div>
      ) : isFilteredView ? (
        <section className="filtered-section">
          <div className="filtered-header">
            <h1>Search Results</h1>
            <button onClick={goBackToHomePage} className="back-button">
              <IonIcon icon={arrowBackOutline} className="back-icon" />
              Back to Home
            </button>
          </div>
          <PackagesList packages={filteredPackages} />
        </section>
      ) : (
        <>
          <HeroSection />
          <div className="calculator-section">
            <button
              style={{
                borderColor: "white!",
                backgroundColor: "white",
                color: "#2ecc71",
                border: "2px solid #2ecc71!",
                borderRadius: "8px!",
                fontSize: "1.2rem",
                fontSize: "600",
                cursor: "pointer",
              }}
            >
              {/* <IonIcon icon={calculatorOutline} className="calculator-icon" /> */}
              Solar Need Calculator
            </button>
            <p className="calculator-description">
              Find the perfect solar solution for your needs
            </p>
          </div>
          <section className="featured-section">
            <div className="section-header">
              <h1>Featured Listings</h1>
              <p>Discover our top-rated solar packages</p>
            </div>
            <PackagesList packages={packages} />
          </section>
        </>
      )}
    </div>
  );
}
