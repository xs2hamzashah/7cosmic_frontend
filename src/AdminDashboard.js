import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatsComponent from "./Components/StatsComponent";
import SellerListing from "./Components/SellerListing";
import AdminPackageManager from "./Components/AdminPackageManager";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    sellers: { total: 0, islamabad: 0, lahore: 0, karachi: 0 },
    buyers: { total: 0, islamabad: 0, lahore: 0, karachi: 0 },
    packages: { total: 0, approved: 0, unapproved: 0 },
  });

  const [sellerListingData, setSellerListingData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All"); // Add state for selected city
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedSellerPackages, setSelectedSellerPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(sellerListingData);
  const navigate = useNavigate();

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.clear();
      navigate("/login");
      return null;
    }

    try {
      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/refresh-token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (!refreshResponse.ok) {
        localStorage.clear();
        navigate("/login");
        return null;
      }

      const tokens = await refreshResponse.json();
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      return tokens.access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.clear();
      navigate("/login");
      return null;
    }
  };

  const makeAuthenticatedRequest = async (url) => {
    let token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please log in.");

    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const newToken = await handleTokenRefresh();
      if (!newToken) return null;

      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // setError(null);

        // Fetch stats data
        const data = await makeAuthenticatedRequest(
          `${API_BASE_URL}/api/listings/analytics/admin_analytics/`
        );

        if (data) {
          const sellersByCity = {
            islamabad:
              data.sellers.seller_by_city_count.find(
                (city) => city.city === "ISB"
              )?.count || 0,
            lahore:
              data.sellers.seller_by_city_count.find(
                (city) => city.city === "LHR"
              )?.count || 0,
            karachi:
              data.sellers.seller_by_city_count.find(
                (city) => city.city === "KRH"
              )?.count || 0,
            total: data.sellers.total,
          };

          const buyersByCity = {
            islamabad:
              data.buyers.buyer_by_city_count.find(
                (city) => city.city === "ISB"
              )?.count || 0,
            lahore:
              data.buyers.buyer_by_city_count.find(
                (city) => city.city === "LHR"
              )?.count || 0,
            karachi:
              data.buyers.buyer_by_city_count.find(
                (city) => city.city === "KRH"
              )?.count || 0,
            total: data.buyers.total,
          };

          const packagesByCity = {
            total: data.solar_solutions.total,
            approved: data.solar_solutions.approved,
            unapproved: data.solar_solutions.unapproved,
          };

          setStatsData({
            sellers: sellersByCity,
            buyers: buyersByCity,
            packages: packagesByCity,
          });
        }

        // Fetch sellers data
        const sellerData = await makeAuthenticatedRequest(
          `${API_BASE_URL}/api/accounts/profiles/?role=seller`
        );

        if (sellerData) {
          setSellerListingData(sellerData.results || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError(error.message);
        setSellerListingData([]); // Ensure state doesn't break
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  // =================================================
  // Packages total and city base
  // =================================================

  const handleStatsClick = async (type, filter) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      let apiUrl = `${API_BASE_URL}/api/listings/analytics/admin_analytics/`;

      // Append city filter if it's not "all"
      if (type === "city" && filter !== "all") {
        apiUrl += `?city=${filter}`;
      }

      const allowedCities = ["ISB", "KRH", "LHR"];

      if (allowedCities.includes(filter)) {
        setSelectedCity(filter);
      } else {
        setSelectedCity("All"); // Or avoid calling the function entirely
      }

      // Fetch data from the API
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Update the packagesByCity based on API response
      const packagesByCity = {
        total: data.solar_solutions.total,
        approved: data.solar_solutions.approved,
        unapproved: data.solar_solutions.unapproved,
      };

      // Update the statsData state
      setStatsData((prevStatsData) => ({
        ...prevStatsData,
        packages: packagesByCity,
      }));

      setSelectedSeller(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // =========================================================
  // Seller Packages detail list
  // =========================================================

  const handleSellerClick = async (seller) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      // Fetch packages associated with the seller's `id`
      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/?seller=${seller.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log("No packages found for this seller.");
      }

      setSelectedSeller(seller); // Save seller for UI context
      console.log(seller.id);
      setSelectedSellerPackages(data.results || []); // Store packages in state
    } catch (error) {
      console.error("Error fetching seller packages:", error);
      setSelectedSellerPackages([]); // Clear packages on error
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================
  // Delete, Edit, and Approved
  // ================================================

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleApprove = async (packageId) => {
    let approval = null; // Ensure that 'approval' is defined before usage
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      // Step 1: Fetch the package data to get the `approval` object
      const packageUrl = `${API_BASE_URL}/api/listings/solar-solutions/${packageId}/`;

      const packageResponse = await fetch(packageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!packageResponse.ok) {
        throw new Error(
          `Failed to fetch package data. HTTP status: ${packageResponse.status}`
        );
      }

      const packageData = await packageResponse.json();
      approval = packageData?.approval;

      if (!approval) {
        throw new Error("Approval object not found in package data.");
      }

      // Step 2: Check if the approval status is true or false and make the appropriate API call
      const approvalUrl = approval.admin_verified
        ? `${API_BASE_URL}/api/operations/approvals/${approval.id}/unapprove/`
        : `${API_BASE_URL}/api/operations/approvals/${approval.id}/approve/`;

      const payload = approval.admin_verified
        ? {} // Unapprove may not require a payload
        : {
            admin_verified: true,
            discrepancy: "No issues found", // Adjust dynamically if needed
            discrepancy_resolved: true,
            email_notification_sent: true,
          };

      // Step 3: Make the API call to approve or unapprove
      const approvalResponse = await fetch(approvalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: approval.admin_verified ? null : JSON.stringify(payload),
      });

      if (!approvalResponse.ok) {
        const errorData = await approvalResponse.json();
        throw new Error(
          `Failed to ${
            approval.admin_verified ? "unapprove" : "approve"
          } package. HTTP status: ${approvalResponse.status}. Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const approvalData = await approvalResponse.json();
      console.log(
        `Package ${
          approval.admin_verified ? "unapproved" : "approved"
        } successfully:`,
        approvalData
      );

      toast.success(
        `Package ${
          approval.admin_verified ? "unapproved" : "approved"
        } successfully!`
      );

      // Step 4: Update the package list locally
      setSelectedSellerPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === packageId
            ? {
                ...pkg,
                approval: {
                  ...pkg.approval,
                  admin_verified: !approval.admin_verified, // Toggle approval status
                },
              }
            : pkg
        )
      );

      await handleStatsClick();

      // Step 5: Reload the seller's packages
      if (selectedSeller) {
        await handleSellerClick(selectedSeller);
      }
    } catch (error) {
      console.error("Error updating package approval status:", error);
      toast.error(
        `Failed to ${
          approval && approval.admin_verified ? "unapprove" : "approve"
        } the package: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      const isConfirmed = window.confirm(
        "Are you sure you want to delete this package?"
      );
      if (!isConfirmed) return;

      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete package. HTTP status: ${response.status}`
        );
      }

      toast.success("Package deleted successfully!");

      // Update the package list locally
      setSelectedSellerPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== id)
      );

      // await handleStatsClick();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(`Failed to delete the package: ${error.message}`);
    }
  };

  function handleLogout() {
    // Clear any stored tokens or session data
    localStorage.removeItem("accessToken"); // Assuming the token is stored as 'accessToken'

    // Redirect to the login page or homepage
    window.location.href = "/login"; // Update this path based on your application's routing
  }

  return (
    <>
      <div className="header flex justify-between items-center px-6 py-4  border-b-1 border-[#ff6f20]">
        <h1 className="text-2xl font-bold text-[#ff6f20]">Admin Dashboard</h1>
        <button
          className="border-2 border-[#ff6f20] text-[#ff6f20] font-medium py-2 px-4 rounded-lg transition duration-200 hover:bg-[#ff6f20] hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div id="body" className="py-10">
        <ToastContainer />
        <StatsComponent
          title="Sellers"
          {...statsData.sellers}
          onCityClick={(city) => handleStatsClick("city", city)}
          onTotalClick={() => handleStatsClick("city", "all")}
        />
        <StatsComponent title="Buyers" {...statsData.buyers} />

        <div className="stats-container bg-gray-100 p-3 rounded-lg shadow-md ">
          <h3 className="stats-title text-xl font-bold text-gray-800 mb-4">
            Packages
          </h3>
          <div className="stats-box grid grid-cols-3 gap-6 items-center">
            {/* Total Packages */}
            <div className="stats-total bg-[#ff6f20] text-white p-2 rounded-lg text-center">
              <span className="block text-md font-medium uppercase">
                Total Packages
              </span>
              <h2 className="text-3xl font-extrabold">
                {statsData.packages.total}
              </h2>
            </div>

            {/* Approved Packages */}
            <div className="stats-city bg-white border border-gray-300 rounded-lg p-3 text-center">
              <span className="block text-[#ff6f20] font-semibold uppercase">
                Approved Packages
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.packages.approved}
              </p>
            </div>

            {/* Unapproved Packages */}
            <div className="stats-city bg-white border border-gray-300 rounded-lg p-3 text-center">
              <span className="block text-[#ff6f20] font-semibold uppercase">
                Unapproved Packages
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.packages.unapproved}
              </p>
            </div>
          </div>
        </div>

        {/* Seller Table */}
        <SellerListing
          sellers={sellerListingData}
          onSellerClick={handleSellerClick}
          selectedCity={selectedCity}
        />

        {selectedSeller && (
          <div className="seller-packages-section my-10">
            <h3
              className={`text-2xl font-bold mt-5 my-5 ${
                selectedSellerPackages.length > 0 ? "#ff6f20" : "#dc3545"
              }`}
            >
              {selectedSellerPackages.length > 0
                ? `${selectedSeller.company?.name}'s Packages`
                : `No Packages Found for ${selectedSeller.company?.name}`}
            </h3>
            <AdminPackageManager
              packages={selectedSellerPackages}
              onEdit={handleEdit}
              onApprove={handleApprove}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
