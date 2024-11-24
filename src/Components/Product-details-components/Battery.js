import React, { useState, useEffect } from "react";

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
        "http://127.0.0.1:8000/api/listings/components/?component_type=Battery",
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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Authorization required. Please log in.");
        return;
      }

      const postResponse = await fetch(
        "http://127.0.0.1:8000/api/listings/components/",
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
        alert(`Failed to post data: ${JSON.stringify(errorData)}`);
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
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="roller">
      <div className="component-head">
        <h2>Battery</h2>
        <button className="button" onClick={toggleSection}>
          <ion-icon name={isOpen ? "remove-outline" : "add-outline"}></ion-icon>
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
            type="text"
            placeholder="Warranty"
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
          />
          <input
            type="text"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="total Backup Capacity"
            value={totalBackupCapacity}
            onChange={(e) => setTotalBackupCapacity(e.target.value)}
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
              </tr>
            </thead>
            <tbody>
              {batteryData.length > 0 ? (
                batteryData.map((battery) => (
                  <tr
                    key={battery.id}
                    onClick={() => handleSelectComponent(battery)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(battery.id) && {
                        backgroundColor: "#ff6e2088",
                      }), // Change color if id matches
                    }}
                  >
                    <td>{battery.subtype}</td>
                    <td>{battery.brand}</td>
                    <td>{battery.details}</td>
                    <td>{battery.capacity}</td>
                    <td>{battery.warranty}</td>
                    <td>{battery.quantity}</td>
                    <td>{battery.total_backup_capacity}</td>
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

export default Battery;
