import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import API_BASE_URL from "../config";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isFilteredView, setIsFilteredView] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listings/solar-solutions/`
        );
        const data = await response.json();
        setPackages(data); // Store all packages
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const priceRangeMap = {
    below_1M: "1.00",
    below_2M: "2.00",
    below_3M: "3.00",
    above_3M: "3.01",
  };

  const handleSearch = (searchParams) => {
    const { city, size = "", price_range, query } = searchParams;

    const results = packages.filter((pkg) => {
      const matchesCity = city ? pkg.city === city : true;
      const matchesSize = size ? pkg.size == Number(size) : true;

      const selectedPriceRange = priceRangeMap[price_range];
      const matchesPrice = price_range
        ? price_range === "above_3M"
          ? parseFloat(pkg.price) > parseFloat(priceRangeMap["below_3M"] || 0)
          : parseFloat(pkg.price) <= parseFloat(selectedPriceRange || 0)
        : true;

      const matchesQuery = query
        ? pkg.display_name.toLowerCase().includes(query.toLowerCase())
        : true;

      return matchesCity && matchesSize && matchesPrice && matchesQuery;
    });

    setFilteredPackages(results);
    setIsFilteredView(true); // Switch to filtered view
  };

  const goBackToHomePage = () => {
    setIsFilteredView(false); // Switch back to homepage view
  };

  return (
    <section>
      <Navbar onSearch={handleSearch} />

      {/* Conditional Rendering */}
      {isFilteredView ? (
        <section className="filtered-section">
          <h1>Search Results</h1>
          <button onClick={goBackToHomePage} className="back-button">
            <IonIcon icon={arrowBackOutline} className="back-icon" />
            Back to Home
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
