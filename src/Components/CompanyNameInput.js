import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import axios from "axios";

const CompanyNameInput = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  // Debounce function to delay API call
  useEffect(() => {
    // Prevent API call if the searchTerm is "Other"
    if (searchTerm.trim() === "" || searchTerm === "Other") {
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
    setSelectedCompany(company);
    setSuggestions([]);
  };

  const handleCustomName = () => {
    // Assign "Other" if the name isn't in the suggestions
    if (!suggestions.includes(searchTerm)) {
      setSelectedCompany("Other");
      setSearchTerm("Other"); // This will now stop the API call
    } else {
      setSelectedCompany(searchTerm);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        id="companyName"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value); // Update formData in SignupForm as the user types
        }}
        onBlur={handleCustomName} // Handle onBlur for unmatched names
        placeholder="Company name"
        // style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
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
      {/* {selectedCompany && <div>Selected Company: {selectedCompany}</div>} */}
    </div>
  );
};

export default CompanyNameInput;
