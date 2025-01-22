import React, { useState, useEffect } from "react";
import { usePanelsQuery } from "../../service/priceList/panel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IonIcon } from "@ionic/react";
import {
  removeOutline,
  addOutline,
  addCircleOutline,
  removeCircleOutline,
} from "ionicons/icons";
import API_BASE_URL from "../../config";

const SolarPanel = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [solarData, setSolarData] = useState([]);
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data } = usePanelsQuery({ page: 1 });

  const highlightedIds = components.map((component) => component.id);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/api/listings/components/?component_type=PV%20Module`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filteredData = data.results.map((item) => ({
        brand: item.brand,
        capacity: item.capacity,
        details: item.details,
        warranty: item.warranty,
        quantity: item.quantity,
        id: item.id,
      }));

      setSolarData(filteredData || []);
    } catch (error) {
      console.error("Error fetching Solar Panel data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateInputs = () => {
    if (!brand.trim() || !detail.trim()) {
      toast.error("Please fill in all required text fields.");
      return false;
    }

    // Convert values to numbers and validate
    const capacityNum = Number(capacity);
    const warrantyNum = Number(warranty);
    const quantityNum = Number(quantity);

    if (
      isNaN(capacityNum) ||
      capacityNum <= 0 ||
      isNaN(warrantyNum) ||
      warrantyNum <= 0 ||
      isNaN(quantityNum) ||
      quantityNum <= 0
    ) {
      toast.error("Capacity, Warranty, and Quantity must be positive numbers.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authorization required. Please log in.");
        return;
      }

      const postResponse = await fetch(
        `${API_BASE_URL}/api/listings/components/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            component_type: "PV Module",
            brand: brand,
            details: detail,
            capacity: capacity,
            warranty: warranty,
            quantity: parseInt(quantity, 10),
          }),
        }
      );

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        console.error("POST Error:", errorData);
        toast.error(`Failed to post data: ${JSON.stringify(errorData)}`);
        return;
      }

      const createdComponent = await postResponse.json();
      handleSelectComponent(createdComponent);

      fetchData();

      setBrand("");
      setDetail("");
      setCapacity("");
      setWarranty("");
      setQuantity("");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsOpen(false);
    }
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="roller">
      <ToastContainer />
      <div className="component-head">
        <h2>Solar Panel</h2>

        <button className="button" onClick={toggleSection}>
          <IonIcon
            icon={isOpen ? removeOutline : addOutline}
            className="toggle-icon"
            onClick={() => setIsOpen(!isOpen)}
          />
        </button>
      </div>

      <div className={`component-body ${isOpen ? "open" : ""}`}>
        <div className="component-input">
          <input
            type="text"
            placeholder="Brand Name"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <input
            type="text"
            placeholder="Specifications"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Warranty (Years)"
            value={warranty}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10) || 0);
              setWarranty(value);
            }}
            onWheel={(e) => e.target.blur()} // Prevent up/down buttons
          />
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10) || 0);
              setCapacity(value);
            }}
            onWheel={(e) => e.target.blur()}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10) || 0);
              setQuantity(value);
            }}
            onWheel={(e) => e.target.blur()}
          />
          <button onClick={handleSubmit} className="add-component-btn">
            Add
          </button>
        </div>

        <div className="component-table">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Specification</th>
                <th>Capacity</th>
                <th>Warranty</th>
                <th>Quantity</th>
                <th>Action</th> {/* New column for the button */}
              </tr>
            </thead>
            <tbody>
              {solarData.length > 0 ? (
                solarData.map((solar) => (
                  <tr
                    key={solar.id}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(solar.id) && {
                        backgroundColor: "#ff6e2088",
                      }),
                    }}
                  >
                    <td>{solar.brand}</td>
                    <td>{solar.details}</td>
                    <td>{solar.capacity}</td>
                    <td>{solar.warranty}</td>
                    <td>{solar.quantity}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectComponent(solar);
                          setIsOpen(false);
                        }}
                        className={`p-2 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center bg-[#ff6f20] text-white rounded-md ${
                          highlightedIds.includes(solar.id)
                            ? "hover:bg-red-50 focus:ring-red-500"
                            : "hover:bg-green-50 focus:ring-green-500"
                        }`}
                      >
                        {highlightedIds.includes(solar.id) ? (
                          <IonIcon
                            icon={removeCircleOutline}
                            className="w-6 h-6 transition-transform duration-200 "
                            color="#dc2626" // Red-600
                            style={{
                              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                            }}
                          />
                        ) : (
                          <IonIcon
                            icon={addCircleOutline}
                            className="w-6 h-6 transition-transform duration-200"
                            color="#16a34a" // Green-600
                            style={{
                              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                            }}
                          />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SolarPanel;
