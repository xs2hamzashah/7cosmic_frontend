import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import "../CSS/AddPackageForm.css";
import API_BASE_URL from "../config";
import axios from "axios";

const AddPackageForm = ({ mode = "add", packageData = {}, packageId }) => {
  const [formData, setFormData] = useState({
    price: "",
    size: "",
    solution_type: "On-Grid", // Default value
  });
  const [validationError, setValidationError] = useState(""); // For displaying validation errors

  const navigate = useNavigate();

  // Prefill form if in "edit" mode
  useEffect(() => {
    if (mode === "edit" && packageData) {
      setFormData({
        price: packageData.price || "",
        size: packageData.size || "",
        solution_type: packageData.solution_type || "On-Grid",
      });
    }
  }, [mode, packageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict `price` and `size` to positive integers
    if (
      (name === "price" || name === "size") &&
      (isNaN(value) || value.includes(".") || value < 0)
    ) {
      return; // Ignore invalid input
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const { price, size } = formData;

    // Ensure all fields are filled
    if (!price.trim() || !size.trim()) {
      setValidationError("Both price and size fields must be filled.");
      return false;
    }

    // Price-specific validations
    const priceValue = parseInt(price, 10);
    if (priceValue < 100000) {
      setValidationError("Price must be at least 1 lac (100,000).");
      return false;
    }
    if (priceValue % 1000 !== 0) {
      setValidationError("Price must be a multiple of 1000.");
      return false;
    }

    // Size-specific validations
    const sizeValue = parseInt(size, 10);
    if (sizeValue < 3) {
      setValidationError("Package Size must be at least 3 kW.");
      return false;
    }

    setValidationError(""); // Clear error if all fields are valid
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation before making the API request
    if (!validateFields()) {
      return;
    }

    try {
      const url =
        mode === "edit"
          ? `${API_BASE_URL}/api/listings/solar-solutions/${packageId}/`
          : `${API_BASE_URL}/api/listings/solar-solutions/`;

      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: formData,
      });

      if (response.status === 201 || response.status === 200) {
        if (mode === "edit") {
          // Redirect to the same product detail page after editing
          navigate(`/product-detail-list/${packageId}`);
        } else {
          // Redirect to the product detail page of the new package
          navigate(`/product-detail-list/${response.data.id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting package:", error.response?.data);
    }
  };

  return (
    <section id="body" className="adding-package">
      <h1 className="main-text">
        {mode === "edit" ? "Edit Package" : "Add New Package"}
      </h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Price (PKR)"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Package Size (kW)"
            name="size"
            value={formData.size}
            onChange={handleChange}
          />
          <select
            name="solution_type"
            value={formData.solution_type}
            onChange={handleChange}
          >
            <option value="On-Grid">On-Grid</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {mode !== "edit" && ( // Conditionally render the submit button
            <button type="submit">
              <IonIcon icon={arrowForwardOutline} />
            </button>
          )}
        </form>
      </div>
      {validationError && <p className="error">{validationError}</p>}
    </section>
  );
};

export default AddPackageForm;
