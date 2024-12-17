import React from "react";

const StatsComponent = ({
  title,
  total = 0,
  islamabad = 0,
  lahore = 0,
  karachi = 0,
  onCityClick = () => {},
  onTotalClick = () => {},
}) => {
  return (
    <div className="stats-container">
      <h3 className="stats-title">{title}</h3>
      <div className="stats-box">
        {/* Total Stats */}
        <div
          className="stats-total"
          onClick={onTotalClick}
          style={{ cursor: "pointer" }}
        >
          <span>Total</span>
          <h2>{total}</h2>
        </div>

        {/* City-wise Stats */}
        <div className="stats-cities">
          <div
            className="stats-city"
            onClick={() => onCityClick("ISB")}
            style={{ cursor: "pointer" }}
          >
            <span>Islamabad</span>
            <p>{islamabad}</p>
          </div>
          <div
            className="stats-city"
            onClick={() => onCityClick("LHR")}
            style={{ cursor: "pointer" }}
          >
            <span>Lahore</span>
            <p>{lahore}</p>
          </div>
          <div
            className="stats-city"
            onClick={() => onCityClick("KRH")}
            style={{ cursor: "pointer" }}
          >
            <span>Karachi</span>
            <p>{karachi}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;
