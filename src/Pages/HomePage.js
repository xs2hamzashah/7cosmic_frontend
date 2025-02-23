import React, { useState, useEffect, useContext, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, searchOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import PackagesList from "../Components/PackagesList";
import { ProfileContext } from "../context/ProfileContext";
import API_BASE_URL from "../config";



// green-50: #eafaf1
// green-100: #d5f5e3
// green-200: #abebc6
// green-300: #82e0aa
// green-400: #58d68d
// green-500: #2ecc71
// green-600: #28b463
// green-700: #239b56
// green-800: #1d8348
// green-900: #186a3b

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
        `${API_BASE_URL}/api/listings/solar-solutions/?approved=true&page=${pageNumber}`
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
        `${API_BASE_URL}/api/listings/solar-solutions/?${queryString}&approved=true`
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
    <main className="min-h-screen ">
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#2ecc71]/20 border-t-[#2ecc71] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IonIcon
                icon={searchOutline}
                className="w-6 h-6 text-[#2ecc71]"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Searching for solar solutions...
          </p>
        </div>
      ) : isFilteredView ? (
        <section className="container mx-auto px-4 md:px-8 py-12">
          <div className="relative">
            <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Search Results
                </h1>
                <p className="text-gray-500 mt-1">
                  Found {filteredPackages.length} matching solutions
                </p>
              </div>
              <button
                onClick={goBackToHomePage}
                className="flex items-center gap-2 px-5 py-2.5 text-[#2ecc71] hover:text-white hover:bg-[#2ecc71] border-2 border-[#2ecc71] rounded-lg transition-all duration-300"
              >
                <IonIcon icon={arrowBackOutline} className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            <PackagesList packages={filteredPackages} />
          </div>
        </section>
      ) : (
        <>
          <HeroSection />
          <section className="container mx-auto px-4 md:px-8 py-16">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#2ecc71]/10 rounded-full">
                <span className="w-2 h-2 bg-[#2ecc71] rounded-full animate-pulse" />
                <span className="text-[#2ecc71] font-medium">
                  Featured Solutions
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Top Solar Packages
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our curated selection of premium solar solutions
                designed to meet your energy needs
              </p>
            </div>

            <div className="relative">
              {/* <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-50 to-transparent" /> */}
              <PackagesList packages={packages} />
              {/* <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-50 to-transparent" /> */}
            </div>
          </section>
        </>
      )}
    </main>
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
