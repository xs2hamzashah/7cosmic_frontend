import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Calculator.css";

const CalculatorButtons = () => {
  // implement functionality to redirect to the calculator page

  const navigation = useNavigate();

  const [numberInput, setNumberInput] = useState("");
  const [calculatorType, setCalculatorType] = useState("");
  const [showSolarCostPopup, setShowSolarCostPopup] = useState(false);

  // Function to handle the calculation and redirection
  // const handleCalculate = () => {
  //   if (!numberInput || !calculatorType) {
  //     alert("Please fill in all the fields.");
  //     return;
  //   }

  //   const data = {
  //     search: numberInput,
  //     systemType: calculatorType === "Hybrid" ? "hybrid" : "on-grid",
  //   };

  //   const url = `https://7-solar-calculators-production.up.railway.app/tools/solar-cost-calculator/${data.search}-kilo-watt-solar-cost?systemType=${data.systemType}&batteryType=tubular&voltageType=lv&structureType=iron_standard`;

  //   console.log("Redirecting to:", url);

  //   // Redirect to the constructed URL
  //   window.location.href = url;

  //   // Close the popup
  //   setShowSolarCostPopup(false);
  // };

  const handleSolarCostCalculator = () => {
    navigation("/seller/calculator");
  };

  return (
    <div className="space-x-4">
      <button
        className="btn"
        style={{ marginRight: "10px" }}
        onClick={handleSolarCostCalculator}
      >
        Solar Cost Calculator
      </button>

      <button
        className="btn"
        style={{ marginRight: "10px" }}
        onClick={() => navigation("/seller/price-list")}
      >
        Inventory Management
      </button>

      {/* <button className="ghost">Solar Need Calculator</button> */}

      {/* Popup for Solar Cost Calculator */}
      {showSolarCostPopup && (
        <div className="calculator-pop-up">
          <div className="calculator-section">
            <h3>Solar Cost Calculator</h3>
            <div>
              <input
                type="number"
                value={numberInput}
                placeholder="Enter Number (kW):"
                onChange={(e) => setNumberInput(e.target.value)}
              />
            </div>
            <div>
              <select
                value={calculatorType}
                onChange={(e) => setCalculatorType(e.target.value)}
              >
                <option value="">System Type</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On Grid">On Grid</option>
              </select>
            </div>
            {/* <button onClick={handleCalculate}>Calculate</button> */}
            <button onClick={() => setShowSolarCostPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Background overlay for popup */}
      {showSolarCostPopup && (
        <div
          onClick={() => setShowSolarCostPopup(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default CalculatorButtons;
