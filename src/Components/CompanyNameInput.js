import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyNameInput = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce function to delay API call
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.7solar.pk/api/accounts/api/company-names/?search=${query}`
      );
      setSuggestions(response.data.company_names || []);
    } catch (error) {
      console.error("Error fetching company names:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (company) => {
    setSearchTerm(company);
    onChange(company); // Notify parent about the selected company
    setSuggestions([]);
  };

  const handleBlur = () => {
    // Check if the search term is in the suggestions list
    if (!suggestions.includes(searchTerm)) {
      onChange("Other"); // Assign "Other" internally
    } else {
      onChange(searchTerm); // Assign the selected company
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        id="companyName"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          const newSearchTerm = e.target.value;
          setSearchTerm(newSearchTerm);
          setSuggestions([]); // Clear suggestions while typing
        }}
        onBlur={handleBlur} // Trigger the "Other" logic on blur
        placeholder="Company name"
      />
      {loading && <div>Loading...</div>}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 10,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((company, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(company)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {company}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyNameInput;
