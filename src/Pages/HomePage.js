import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import CalculatorButtons from "../Components/CalculatorButtons";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all packages initially
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listings/solar-solutions/`
        );
        const data = await response.json();
        setPackages(data); // Store all packages
        setFilteredPackages(data); // Initially set filtered packages to all
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const priceRangeMap = {
    below_1M: "1.00", // Database value for "below 1M"
    below_2M: "2.00", // Database value for "below 2M"
    below_3M: "3.00", // Database value for "below 3M"
    above_3M: "3.01", // Value greater than 3M in the database
  };

  const handleSearch = (searchParams) => {
    const { city, size = "", price_range, query } = searchParams; // Default to empty string if size is undefined

    const results = packages.filter((pkg) => {
      const matchesCity = city ? pkg.city === city : true;
      const matchesSize = size ? pkg.size == Number(size) : true;

      // Debugging logs
      console.log(
        `pkg.size: ${pkg.size}, size: ${size}, matchesSize: ${matchesSize}`
      );

      // Get the corresponding value for the selected price range
      const selectedPriceRange = priceRangeMap[price_range];

      // Price comparison logic
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
    setIsSearching(true); // Set searching state to true
  };

  return (
    <section>
      <Navbar onSearch={handleSearch} />
      {!isSearching && <HeroSection />}
      <div className="calculator">
        <CalculatorButtons />
      </div>
      <section className="card-section">
        <h1>Featured Listing</h1>
        <PackagesList
          packages={
            isSearching
              ? filteredPackages.filter((pkg) => pkg != null) // Filter out null/undefined packages
              : packages
          }
        />
      </section>
    </section>
  );
}
