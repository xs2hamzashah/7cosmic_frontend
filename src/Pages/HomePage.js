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

  // Loading skeleton for packages
  const PackagesSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Profile loading skeleton
  const ProfileLoadingSkeleton = () => (
    <div className="animate-pulse flex items-center space-x-4">
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );

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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F20]"></div>
          </div>
          <PackagesSkeleton />
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
