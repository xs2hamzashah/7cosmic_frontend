import React, { useState } from "react";

const SearchBox = ({ onSearch, onClose }) => {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {
      city: city === "all" ? "" : city,
      size: size === "any" ? "" : size,
      price_range: priceRange === "any" ? "" : priceRange,
      query: inputText,
    };

    onSearch(params);
    onClose();
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="search-select"
      >
        <option value="" disabled selected hidden>
          City
        </option>
        <option value="all">All Cities</option>
        <option value="ISB">Islamabad</option>
        <option value="KAR">Karachi</option>
        <option value="LHR">Lahore</option>
      </select>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Search by keyword"
        className="search-bar"
      />

      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="search-select"
      >
        <option value="" disabled selected hidden>
          Size (kW)
        </option>
        <option value="any">Any size</option>
        <option value="5">5 (kW)</option>
        <option value="10">10 (kW)</option>
        <option value="15">15 (kW)</option>
        <option value="20">20 (kW)</option>
      </select>

      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="search-select"
      >
        <option value="" disabled selected hidden>
          Price (PKR)
        </option>
        <option value="any">Any range</option>
        <option value="below_1M">Below 10 Lac</option>
        <option value="below_2M">Below 20 Lac</option>
        <option value="below_3M">Below 30 Lac</option>
        <option value="above_3M">Above 30 Lac</option>
      </select>

      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
