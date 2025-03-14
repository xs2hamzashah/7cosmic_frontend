import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/SellerAnalytics.css";

// Register necessary Chart.js elements
Chart.register(ArcElement, Legend, Tooltip);

const SellerAnalytics = () => {
  const { id: sellerId } = useParams(); // Get seller ID from the URL
  const [sellerData, setSellerData] = useState(null);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://127.0.0.1:8000/api/listings/analytics/seller_analytics/?seller_id=${sellerId}`,
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
      } catch (error) {
        console.error("Error fetching seller analytics:", error);
      }
    };

    fetchData();
  }, [sellerId]);

  if (!sellerData) return <p>Loading...</p>;

  // Prepare data for Chart.js (Pie Chart)
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

  return (
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
              ? `http://127.0.0.1:8000${displayImagePath}`
              : null;

            return (
              <li key={product.id} className="package-card">
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
              </li>
            );
          })}
        </ul>

        <button
          className="add-new-package"
          onClick={() => navigate("/add-product/:id")}
        >
          Add New Package
        </button>
      </div>
    </div>
  );
};

export default SellerAnalytics;
