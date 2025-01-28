import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBox = ({ onSearch, onClose }) => {
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [inputText, setInputText] = useState("");

  const performSearch = () => {
    const params = {
      city: city === "all" ? "" : city,
      size: size === "any" ? "" : size,
      price_range: priceRange === "any" ? "" : priceRange,
      query: inputText,
    };

    // const isAnyFieldFilled = Object.values(params).some((value) => value);

    // if (!isAnyFieldFilled) {
    //   toast.info("Please fill at least one field to perform a search.");
    //   return;
    // }

    onSearch(params);
    if (onClose) onClose();
  };

  const handleSelectChange = (setter, value) => {
    setter(value); // Update the state
    performSearch(); // Trigger the search
  };

  return (
    <form className="search-form">
      <ToastContainer />
      <select
        value={city}
        onChange={(e) => handleSelectChange(setCity, e.target.value)}
        className="search-select"
      >
        <option value="" disabled hidden>
          City
        </option>
        <option value="all">All Cities</option>
        <option value="ISB">Islamabad</option>
        <option value="KAR">Karachi</option>
        <option value="LHR">Lahore</option>
      </select>

      <select
        value={size}
        onChange={(e) => handleSelectChange(setSize, e.target.value)}
        className="search-select"
      >
        <option value="" disabled hidden>
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
        onChange={(e) => handleSelectChange(setPriceRange, e.target.value)}
        className="search-select"
      >
        <option value="" disabled hidden>
          Price (PKR)
        </option>
        <option value="any">Any range</option>
        <option value="below_1M">Below 10 Lac</option>
        <option value="below_2M">Below 20 Lac</option>
        <option value="below_3M">Below 30 Lac</option>
        <option value="above_3M">Above 30 Lac</option>
      </select>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Search by keyword"
        className="search-bar"
      />

      <button
        type="button" // Change to button type so it doesn't reload
        className="search-btn"
        onClick={performSearch}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
