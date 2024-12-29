import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import { usePanelsQuery } from "../../service/priceList/panel";

import { IonIcon } from "@ionic/react";
import { removeOutline, addOutline } from "ionicons/icons";
import API_BASE_URL from "../../config";


const SolarPanel = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [solarData, setSolarData] = useState([]);
  const [solarType, setSolarType] = useState("");
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data } = usePanelsQuery({ page: 1 });

  console.log("🚀 ~ SolarPanel ~ data:", data);

  // <td>{solar.subtype}</td>
  // <td>{solar.brand}</td>
  // <td>{solar.details}</td>
  // <td>{solar.capacity}</td>
  // <td>{solar.warranty}</td>
  // <td>{solar.quantity}</td>

  const _solarData = Array.isArray(data?.results)
    ? data.results.map((item) => ({
        id: item.id,
        brand: item.brand_name,
        details: item.specification,
        quantity: item.quantity,
        capacity: item.capacity,
      }))
    : [];

  console.log("🚀 ~ SolarPanel ~ _solarData:", _solarData);

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
        subtype: item.subtype,
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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Authorization required. Please log in.");
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
            subtype: solarType,
            brand: brand,
            details: detail,
            capacity: capacity.toString(),
            warranty: warranty.toString(),
            quantity: parseInt(quantity, 10), // Ensure quantity is an integer
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

      setSolarType("");
      setBrand("");
      setDetail("");
      setCapacity("");
      setWarranty("");
      setQuantity("");
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
            placeholder="Solar Type"
            value={solarType}
            onChange={(e) => setSolarType(e.target.value)}
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
          <button onClick={handleSubmit} className="add-component-btn">
            Add
          </button>
        </div>

        <div className="component-table">
          <table>
            <thead>
              <tr>
                {/* <th>Solar Type</th> */}
                <th>Brand</th>
                <th>Specification</th>
                <th>Capacity</th>
                <th>Warranty</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {_solarData.length > 0 ? (
                _solarData.map((solar) => (
                  <tr
                    key={solar.id}
                    onClick={() => handleSelectComponent(solar)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(solar.id) && {
                        backgroundColor: "#ff6e2088",
                      }), // Change color if id matches
                    }}
                  >
                    {/* <td>{solar.subtype}</td> */}
                    <td>{solar.brand}</td>
                    <td>{solar.details}</td>
                    <td>{solar.capacity}</td>
                    <td>{solar.warranty}</td>
                    <td>{solar.quantity}</td>
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
