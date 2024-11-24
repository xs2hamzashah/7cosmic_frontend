import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPackageForm = () => {
  const [formData, setFormData] = useState({
    price: "",
    size: "",
    solution_type: "On-Grid", // Set a default value to match expected data format
  });
  const navigate = useNavigate();

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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/listings/solar-solutions/",
        {
          size: formData.size,
          price: formData.price,
          solution_type: formData.solution_type,
        },
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
      console.error("Error adding package:", error.response?.data);
      if (error.response) {
        console.error("Error response data:", error.response.data); // Log detailed error from the server
        console.log("Data to send:", formData);
      }
    }
  };

  return (
    <section className="adding-package">
      <h1 className="main-text">Add New Package</h1>
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
