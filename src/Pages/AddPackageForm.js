import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import "../CSS/AddPackageForm.css";
import API_BASE_URL from "../config";
import axios from "axios";

const AddPackageForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    price: "",
    size: "",
    solution_type: "On-Grid",
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "price" || name === "size") &&
      (isNaN(value) || value.includes(".") || value < 0)
    ) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const { price, size } = formData;

    if (!price.trim() || !size.trim()) {
      setValidationError("Both price and size fields must be filled.");
      return false;
    }

    const priceValue = parseInt(price, 10);
    if (priceValue < 100000) {
      setValidationError("Price must be at least 1 lac (100,000).");
      return false;
    }
    if (priceValue % 1000 !== 0) {
      setValidationError("Price must be a multiple of 1000.");
      return false;
    }

    const sizeValue = parseInt(size, 10);
    if (sizeValue < 3) {
      setValidationError("Package Size must be at least 3 kW.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/listings/solar-solutions/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 201) {
        navigate(`/product-detail-list/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting package:", error.response?.data);
    }
  };

  return (
    <section id="body" className="adding-package">
      <h1 className="main-text">Add New Package</h1>
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

          <button type="submit">
            <IonIcon icon={arrowForwardOutline} />
          </button>
        </form>
      </div>
      {validationError && <p className="error">{validationError}</p>}
    </section>
  );
};

export default AddPackageForm;
