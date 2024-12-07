import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AddPackageForm.css";
import API_BASE_URL from "../config"; 
import axios from "axios";

const AddPackageForm = ({ mode = "add", packageData = {}, packageId }) => {
  const [formData, setFormData] = useState({
    price: "",
    size: "",
    solution_type: "On-Grid", // Default value
  });

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate(`/product-detail-list/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting package:", error.response?.data);
    }
  };

  return (
    <section className="adding-package">
      <h1 className="main-text">
        {mode === "edit" ? "Edit Package" : "Add New Package"}
      </h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Size"
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
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPackageForm;
