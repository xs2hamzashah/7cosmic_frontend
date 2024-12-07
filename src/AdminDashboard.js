import React, { useState, useEffect } from "react";
import StatsComponent from "./Components/StatsComponent";
import SellerListing from "./Components/SellerListing";
import AdminPackageManager from "./Components/AdminPackageManager";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config"; 
import "./CSS/Admin.css";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    sellers: { total: 0, islamabad: 0, lahore: 0, karachi: 0 },
    buyers: { total: 0, islamabad: 0, lahore: 0, karachi: 0 },
    packages: { total: 0, islamabad: 0, lahore: 0, karachi: 0 },
  });

  const [sellerListingData, setSellerListingData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("accessToken");

        if (!token) {
          throw new Error("No access token found. Please log in.");
        }

        // Fetch admin analytics data with Authorization header
        const response = await fetch(
          `${API_BASE_URL}/api/listings/analytics/admin_analytics/`,
          // "http://127.0.0.1:8000/api/listings/analytics/admin_analytics/",
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
        const report = data.report;

        // Aggregate data for stats
        const sellersByCity = {
          islamabad: 0,
          lahore: 0,
          karachi: 0,
          total: report.length,
        };
        const buyersByCity = { islamabad: 0, lahore: 0, karachi: 0, total: 0 };
        const packagesByCity = {
          islamabad: 0,
          lahore: 0,
          karachi: 0,
          total: 0,
        };

        // Prepare seller listing data
        const sellers = report.map((seller, index) => ({
          id: index + 1,
          companyName: seller.seller_name,
          city: seller.products.length > 0 ? seller.products[0].city : "N/A",
          packages: seller.products.length,
          buyers: seller.products.reduce(
            (total, product) => total + product.buyer_interaction_count,
            0
          ),
          whatsappNumber:
            seller.products.length > 0 &&
            seller.products[0].buyer_whatsapp_numbers
              ? seller.products[0].buyer_whatsapp_numbers[0]
              : "N/A",
        }));

        // Prepare package data for AdminPackageManager
        const packages = report.flatMap((seller) =>
          seller.products.map((product) => ({
            id: product.id,
            displayName: product.display_name,
            size: product.size,
            price: product.price,
            solutionType: product.solution_type,
            buyerInteractionCount: product.buyer_interaction_count,
            isApproved: product.is_approved, // Example logic for approval
          }))
        );

        // Update state
        setStatsData({
          sellers: sellersByCity,
          buyers: buyersByCity,
          packages: packagesByCity,
        });
        setSellerListingData(sellers);
        setPackageData(packages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const handleEdit = (id) => {
  //   console.log("Edit package:", id);
  // };

  const handleEdit = (id) => {
    navigate(`/product-detail-list/${id}`);
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      // API URL
      const url = `${API_BASE_URL}/api/operations/approvals/${id}/approve/`;
      // const url = `http://127.0.0.1:8000/api/operations/approvals/${id}/approve/`;

      // Payload
      const payload = {
        admin_verified: true,
        discrepancy: "string",
        discrepancy_resolved: true,
        email_notification_sent: true,
      };

      // Send POST request
      const response = await fetch(url, {
        method: "POST", // Try POST instead of PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to approve package. HTTP status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Package approved successfully:", data);
      alert("Package approved successfully!");
    } catch (error) {
      console.error("Error approving package:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      // Confirm delete action with the user
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this package?"
      );
      if (!isConfirmed) {
        return;
      }

      // Send DELETE request to the API
      const response = await fetch(
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/`,
        // `http://127.0.0.1:8000/api/listings/solar-solutions/${id}/`,
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

      // Remove the deleted package from the state
      setPackageData((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== id)
      );

      alert("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete the package. Please try again.");
    }
  };

  return (
    <div>
      <StatsComponent title="Sellers" {...statsData.sellers} />
      <StatsComponent title="Buyers" {...statsData.buyers} />
      <StatsComponent title="Packages" {...statsData.packages} />

      <SellerListing sellers={sellerListingData} />

      <AdminPackageManager
        packages={packageData}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
