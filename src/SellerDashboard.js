import React from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerDashboard = () => {
  const navigate = useNavigate();

  const handleAddPackageClick = () => {
    navigate("/add-package"); // Adjust route as needed for adding a new package
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales ($)",
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Over the Last 6 Months",
      },
    },
  };

  return (
    <section className="seller-dashboard">
      <h1 className="welcome-text">Dashboard!</h1>
      {/* 
      <div className="sells-detail">
        <div className="box-1">
          <h3>Total buyers</h3>
          <p>42</p>
        </div>

        <div className="graph">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="packages-cards">
        <h2>List of Packages</h2>

        <div className="package-card">
          <div className="package-card-text">
            <h3>Commercial Solar Package</h3>
            <p>$100</p>
          </div>
        </div>

        <div className="package-card">
          <div className="package-card-text">
            <h3>Commercial Solar Package</h3>
            <p>$100</p>
          </div>
        </div>

        <div className="package-card">
          <div className="package-card-text">
            <h3>Commercial Solar Package</h3>
            <p>
              $100 <span>Approved</span>
            </p>
          </div>
        </div>

        <button className="add-new-package" onClick={handleAddPackageClick}>
          Add New Package
        </button>
      </div> */}
    </section>
  );
};

export default SellerDashboard;
