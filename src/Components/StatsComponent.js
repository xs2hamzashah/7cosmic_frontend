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
    <div className="stats-container bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="stats-title text-md font-bold text-gray-800 mb-4">
        {title}
      </h3>
      <div className="stats-box grid grid-cols-4 gap-4 items-center">
        {/* Total Stats */}
        <div
          className="stats-total bg-[#ff6f20] text-white p-3 rounded-lg text-center cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={onTotalClick}
        >
          <span className="block text-base font-medium uppercase">Total</span>
          <h2 className="text-3xl font-extrabold">{total}</h2>
        </div>

        {/* City-wise Stats */}
        <div
          className="stats-city bg-white border border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => onCityClick("ISB")}
        >
          <span className="block text-[#ff6f20] font-semibold uppercase text-sm">
            Islamabad
          </span>
          <p className="text-xl font-bold text-gray-900">{islamabad}</p>
        </div>
        <div
          className="stats-city bg-white border border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => onCityClick("LHR")}
        >
          <span className="block text-[#ff6f20] font-semibold uppercase text-sm">
            Lahore
          </span>
          <p className="text-xl font-bold text-gray-900">{lahore}</p>
        </div>
        <div
          className="stats-city bg-white border border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => onCityClick("KRH")}
        >
          <span className="block text-[#ff6f20] font-semibold uppercase text-sm">
            Karachi
          </span>
          <p className="text-xl font-bold text-gray-900">{karachi}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;
