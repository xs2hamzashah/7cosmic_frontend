import React, { useState, useEffect } from "react";

const Inverter = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inverterData, setInverterData] = useState([]);
  const [inverterType, setInverterType] = useState("");
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ipRating, setIpRating] = useState("");

  const highlightedIds = components.map((component) => component.id);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://127.0.0.1:8000/api/listings/components/?component_type=Inverter",
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
        ip_rating: item.ip_rating,
        warranty: item.warranty,
        quantity: item.quantity,
        id: item.id,
      }));
      setInverterData(filteredData || []);
    } catch (error) {
      console.error("Error fetching inverter data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
            component_type: "Inverter",
            subtype: inverterType,
            brand: brand,
            details: detail,
            capacity: capacity.toString(),
            warranty: warranty.toString(),
            quantity: parseInt(quantity, 10), // Ensure quantity is an integer
            ip_rating: ipRating,
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

      setInverterType("");
      setBrand("");
      setDetail("");
      setCapacity("");
      setWarranty("");
      setQuantity("");
      setIpRating("");
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
        <h2>Inverter</h2>
        <button className="button" onClick={toggleSection}>
          <ion-icon name={isOpen ? "remove-outline" : "add-outline"}></ion-icon>
        </button>
      </div>

      <div className={`component-body ${isOpen ? "open" : ""}`}>
        <form onSubmit={handleSubmit} className="component-input">
          <input
            type="text"
            placeholder="Inverter Type"
            value={inverterType}
            onChange={(e) => setInverterType(e.target.value)}
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
            placeholder="IP Rating"
            value={ipRating}
            onChange={(e) => setIpRating(e.target.value)}
          />
          <button type="submit" className="add-component-btn">
            Add
          </button>
        </form>

        <div className="component-table">
          <table>
            <thead>
              <tr>
                <th>Inverter Type</th>
                <th>Brand</th>
                <th>Specification</th>
                <th>Capacity</th>
                <th>Warranty</th>
                <th>Quantity</th>
                <th>IP Rating</th>
              </tr>
            </thead>
            <tbody>
              {inverterData.length > 0 ? (
                inverterData.map((inverter) => (
                  <tr
                    key={inverter.id}
                    onClick={() => handleSelectComponent(inverter)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(inverter.id) && {
                        backgroundColor: "#ff6e2088",
                      }),
                    }}
                  >
                    <td>{inverter.subtype}</td>
                    <td>{inverter.brand}</td>
                    <td>{inverter.details}</td>
                    <td>{inverter.capacity}</td>
                    <td>{inverter.warranty}</td>
                    <td>{inverter.quantity}</td>
                    <td>{inverter.ip_rating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inverter;
