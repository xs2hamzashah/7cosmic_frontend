import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { removeOutline, addOutline,removeCircleOutline,addCircleOutline } from "ionicons/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../config";

const Battery = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [batteryData, setBatteryData] = useState([]);
  const [batteryType, setBatteryType] = useState("");
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalBackupCapacity, setTotalBackupCapacity] = useState("");

  const highlightedIds = components.map((component) => component.id);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/listings/components/?component_type=Battery`,
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
        subtype: item.subtype,
        brand: item.brand,
        capacity: item.capacity,
        details: item.details,
        warranty: item.warranty,
        quantity: item.quantity,
        total_backup_capacity: item.total_backup_capacity,
        id: item.id,
      }));

      setBatteryData(filteredData || []);
    } catch (error) {
      console.error("Error fetching Battery data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to validate inputs
  const validateInputs = () => {
    // Validation for required text fields
    if (!batteryType || !brand || !detail) {
      toast.error("Battery Type, Brand, and Specifications are required.");
      return false;
    }

    // Validation for numeric fields, ensuring they are numbers and positive integers
    if (
      isNaN(capacity) ||
      isNaN(warranty) ||
      isNaN(quantity) ||
      isNaN(totalBackupCapacity) ||
      Math.max(Number(capacity), 0) <= 0 ||
      Math.max(Number(warranty), 0) <= 0 ||
      Math.max(Number(quantity), 0) <= 0 ||
      Math.max(Number(totalBackupCapacity), 0) <= 0
    ) {
      toast.error(
        "Capacity, Warranty, Quantity, and Total Backup Capacity must be positive numbers."
      );
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
            component_type: "Battery",
            subtype: batteryType,
            brand: brand,
            details: detail,
            capacity: capacity.toString(),
            warranty: warranty.toString(),
            quantity: parseInt(quantity, 10),
            total_backup_capacity: totalBackupCapacity.toString(),
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

      // Refresh the list to include the newly added component
      fetchData();

      setBatteryType("");
      setBrand("");
      setDetail("");
      setCapacity("");
      setWarranty("");
      setQuantity("");
      setTotalBackupCapacity("");
    } catch (error) {
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
        <h2>Battery</h2>
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
            placeholder="Battery Type"
            value={batteryType}
            onChange={(e) => setBatteryType(e.target.value)}
          />
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
            placeholder="Warranty"
            value={warranty}
            onChange={(e) => setWarranty(Math.max(0, e.target.value))}
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(Math.max(0, e.target.value))}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, e.target.value))}
          />

          <input
            type="number"
            placeholder="Total Backup Capacity"
            value={totalBackupCapacity}
            onChange={(e) =>
              setTotalBackupCapacity(Math.max(0, e.target.value))
            }
          />
          <button onClick={handleSubmit} className="add-component-btn">
            Add
          </button>
        </div>

        <div className="component-table">
          <table>
            <thead>
              <tr>
                <th>Battery Type</th>
                <th>Brand</th>
                <th>Specifications</th>
                <th>Capacity</th>
                <th>Warranty</th>
                <th>Quantity</th>
                <th>Total Backup Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {batteryData.length > 0 ? (
  batteryData.map((battery) => (
    <tr
      key={battery.id}
      className={highlightedIds.includes(battery.id) ? 'bg-green-50' : ''}
      style={{
        cursor: "pointer",
        ...(highlightedIds.includes(battery.id) && {
          backgroundColor: "#ff6e2088",
        }),
      }}
    >
      <td>{battery.subtype}</td>
      <td>{battery.brand}</td>
      <td>{battery.details}</td>
      <td>{battery.capacity}</td>
      <td>{battery.warranty}</td>
      <td>{battery.quantity}</td>
      <td>{battery.total_backup_capacity}</td>
      <td>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSelectComponent(battery);
            setIsOpen(false);
          }}
          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            highlightedIds.includes(battery.id)
              ? 'hover:bg-red-50 focus:ring-red-500'
              : 'hover:bg-green-50 focus:ring-green-500'
          }`}
        >
          {highlightedIds.includes(battery.id) ? (
            <IonIcon
              icon={removeCircleOutline}
              className="w-6 h-6 transition-transform duration-200"
              color="#dc2626"
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
              }}
            />
          ) : (
            <IonIcon
              icon={addCircleOutline}
              className="w-6 h-6 transition-transform duration-200"
              color="#16a34a"
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
              }}
            />
          )}
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="8">No data available</td> {/* Updated colspan to 8 for the new action column */}
  </tr>
)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Battery;
