import React from "react";

const StatsComponent = ({ title, total, islamabad, lahore, karachi }) => {
  return (
    <div className="stats-container">
      <h3 className="stats-title">{title}</h3>
      <div className="stats-box">
        <div className="stats-total">
          <span>Total</span>
          <h2>{total}</h2>
        </div>
        <div className="stats-cities">
          <div className="stats-city">
            <span>Islamabad</span>
            <p>{islamabad}</p>
          </div>
          <div className="stats-city">
            <span>Lahore</span>
            <p>{lahore}</p>
          </div>
          <div className="stats-city">
            <span>Karachi</span>
            <p>{karachi}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;
