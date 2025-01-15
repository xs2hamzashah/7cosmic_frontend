import React, { useState, useEffect, useContext, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import { ProfileContext } from "../context/ProfileContext";
import API_BASE_URL from "../config";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isFilteredView, setIsFilteredView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const { profileData, loading: profileLoading } = useContext(ProfileContext);

  const fetchPackages = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/?page=${pageNumber}`
      );
      const data = await response.json();

      setPackages((prev) => {
        const newPackages = [...prev, ...data.results];
        const uniquePackages = Array.from(
          new Map(newPackages.map((item) => [item.id, item])).values()
        );
        return uniquePackages;
      });

      setHasMore(!!data.next); // If `next` is null, there's no more data
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(page);
  }, [page]);

  const handleSearch = async (searchParams) => {
    const { city, size, price_range, query } = searchParams;

    setLoading(true);
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
      setFilteredPackages(data.results);
      setIsFilteredView(true);
    } catch (error) {
      console.error("Error fetching filtered packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBackToHomePage = () => {
    setIsFilteredView(false);
  };

  useEffect(() => {
    if (profileData && profileData.company && profileData.user) {
      setCompanyName(profileData.company.name);
      setSellerEmail(profileData.user.email);
    }
  }, [profileData]);

  const lastPackageElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <section>
      <Navbar
        onSearch={handleSearch}
        companyName={companyName}
        sellerEmail={sellerEmail}
        loading={profileLoading}
      />
      {/* Show HeroSection only when not in filtered view */}
      {!isFilteredView && <HeroSection />}

      {/* Loading Indicator */}
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
          <div className="calculator">
            <button className="ghost">Solar Need Calculator</button>
          </div>
          <section className="card-section">
            <h1>Featured Listing</h1>
            <PackagesList
              packages={packages}
              lastPackageRef={lastPackageElementRef}
            />
          </section>
        </>
      )}
    </section>
  );
}
