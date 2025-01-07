import React, { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import API_BASE_URL from "../config";
import "../CSS/SellerAnalytics.css";
import Navbar from "../Components/Navbar";
import SubscriptionPopup from "../Components/SubscriptionPopup";
import CalculatorButtons from "../Components/CalculatorButtons";
import { ProfileContext } from "../context/ProfileContext";

Chart.register(ArcElement, Legend, Tooltip);

const SellerAnalytics = () => {
  const [sellerData, setSellerData] = useState(null);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const navigate = useNavigate();

  const { profileData, loading: profileLoading } = useContext(ProfileContext);

  useEffect(() => {
    if (profileData && profileData.company && profileData.company.name) {
      setCompanyName(profileData.company.name);
      setSellerEmail(profileData.user?.email || "");
    } else {
      console.warn("Profile data or company information is unavailable.");
    }
  }, [profileData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${API_BASE_URL}/api/listings/analytics/seller_analytics/`,
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
        setSellerData(data);

        const buyersCount = data.products.reduce(
          (acc, product) => acc + product.buyer_interaction_count,
          0
        );
        setTotalBuyers(buyersCount);

        setIsSubscribed(data.is_subscribed || false);
      } catch (error) {
        console.error("Error fetching seller analytics:", error);
      }
    };

    fetchData();
  }, []);

  if (!sellerData) return <p>Loading...</p>;

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowSubscriptionPopup(false);
  };

  const handleAddPackage = () => {
    navigate("/add-product/:id");
  };

  const chartData = {
    labels: sellerData.products.map((product) => product.display_name),
    datasets: [
      {
        label: "Buyer Interaction Count",
        data: sellerData.products.map(
          (product) => product.buyer_interaction_count
        ),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        onHover: (event) => {
          event.native.target.style.cursor = "pointer";
        },
        onLeave: (event) => {
          event.native.target.style.cursor = "default";
        },
      },
    },
  };

  // -------------- EDIT -------------------
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  return (
    <section id="body">
      <Navbar
        companyName={companyName}
        sellerEmail={sellerEmail}
        loading={profileLoading}
      />
      <div className="seller-dashboard">
        <h2 className="welcome-text">Welcome Back, {sellerData.seller_name}</h2>

        <div className="sells-detail">
          <div className="box-1">
            <h3>Total buyers</h3>
            <p>{totalBuyers}</p>
          </div>
          <div className="graph">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="calculator">
          <CalculatorButtons />
        </div>

        <div className="whatsapp-info">
          <h2>Buyers per package list</h2>
          <ul>
            {sellerData.products.map((product) => (
              <li key={product.id} className="whatsapp-item">
                <p>
                  {product.display_name}:{" "}
                  <span>{product.buyer_whatsapp_numbers.length} Buyers</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="packages-cards">
          <h2>Packages List</h2>
          <ul>
            {sellerData.products.map((product) => {
              const displayImagePath =
                product.images.find((img) => img.is_display_image)?.image ||
                product.images[0]?.image;
              const displayImage = displayImagePath
                ? `${API_BASE_URL}${displayImagePath}`
                : null;

              return (
                <li key={product.id} className="package-card relative">
                  <div
                    className="absolute bottom-5 left-36 px-2 py-1 rounded-md text-white text-sm font-medium"
                    style={{
                      backgroundColor: product.is_approved
                        ? "#149921"
                        : "#F39C12", // Green for Approved, Yellow for Pending
                    }}
                  >
                    {product.is_approved ? "Approved" : "Pending.."}
                  </div>
                  <div className="img">
                    {displayImage ? (
                      <img src={displayImage} alt={product.display_name} />
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </div>
                  <div className="package-card-text">
                    <h3>{product.display_name}</h3>
                    <p>Price: ${product.price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      handleEdit(product.id);
                    }}
                  >
                    <IonIcon icon={pencilOutline} />
                    Edit
                  </button>
                </li>
              );
            })}
          </ul>

          <button className="add-new-package" onClick={handleAddPackage}>
            Add New Package
          </button>
        </div>
      </div>

      {showSubscriptionPopup && (
        <SubscriptionPopup
          onClose={() => setShowSubscriptionPopup(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </section>
  );
};

export default SellerAnalytics;
