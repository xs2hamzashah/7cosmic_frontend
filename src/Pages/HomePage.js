import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import CalculatorButtons from "../Components/CalculatorButtons";
import API_BASE_URL from "../config";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

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
    setIsSearching(true);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPackages = isSearching
    ? filteredPackages.slice(startIndex, endIndex)
    : packages.slice(startIndex, endIndex);

  // Calculate total pages
  const totalItems = isSearching ? filteredPackages.length : packages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
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
          packages={paginatedPackages.filter((pkg) => pkg != null)}
        />

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      </section>
    </section>
  );
}
