import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
// import "../CSS/SearchBox.css";

const SearchBox = ({ onSearch, onClose }) => {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {
      city,
      size,
      price_range: priceRange,
      query: inputText,
    };
    onSearch(params);
    onClose(); // Close the search box after submitting
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="search-select"
      >
        <option value="">City</option>
        <option value="ISB">Islamabad</option>
        <option value="KAR">Karachi</option>
        <option value="LHR">Lahore</option>
      </select>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Search..."
        className="search-bar"
      />
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="search-select"
      >
        <option value="">System size</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="search-select"
      >
        <option value="">Price range</option>
        <option value="below_1M">Below 1M</option>
        <option value="below_2M">Below 2M</option>
        <option value="below_3M">Below 3M</option>
        <option value="above_3M">Above 3M</option>
      </select>
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
