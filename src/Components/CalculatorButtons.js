import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Calculator.css";

const CalculatorButtons = () => {
  const navigate = useNavigate();

  const handleSolarCalculator = () => {
    window.open(
      "https://7-solar-calculators-production.up.railway.app/tools/solar-cost-calculator",
      "_blank"
    );
  };

  return (
    <div className="space-x-4">
      <button
        className="btn"
        style={{ marginRight: "10px" }}
        onClick={handleSolarCalculator}
      >
        Solar Cost Calculator
      </button>

      <button
        className="btn"
        style={{ marginRight: "10px" }}
        onClick={() => navigate("/seller/price-list")}
      >
        Inventory Management
      </button>
    </div>
  );
};

export default CalculatorButtons;
