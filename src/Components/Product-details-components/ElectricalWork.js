import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { removeOutline, addOutline } from "ionicons/icons";
import API_BASE_URL from "../../config";

const ElectricalWork = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [electricalData, setElectricalData] = useState([]);
  const [wireMaterial, setWireMaterial] = useState("");
  const [warranty, setWarranty] = useState("");

  const highlightedIds = components.map((component) => component.id);

  // Define fetchData outside useEffect to make it reusable
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/listings/components/?component_type=Electrical%20Work`,
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
        wire_material: item.wire_material,
        warranty: item.warranty,
        id: item.id,
      }));

      setElectricalData(filteredData || []);
    } catch (error) {
      console.error("Error fetching electrical work data:", error);
    }
  };

  useEffect(() => {
    // Initial data fetch on component mount
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
            component_type: "Electrical Work",
            warranty: warranty.toString(),
            wire_material: wireMaterial,
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

      // Clear input fields after submission
      setWarranty("");
      setWireMaterial("");
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
        <h2>Electrical Work</h2>
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
          <select
            name="wireMaterial"
            value={wireMaterial}
            onChange={(e) => setWireMaterial(e.target.value)}
          >
            <option value="">Wire Material</option>
            <option value="Copper">Copper</option>
            <option value="Aluminium">Aluminium</option>
            <option value="PVC">PVC</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Warranty"
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
          />
          <button onClick={handleSubmit} className="add-component-btn">
            Add
          </button>
        </div>

        <div className="component-table">
          <table>
            <thead>
              <tr>
                <th>Wire Material</th>
                <th>Warranty</th>
              </tr>
            </thead>
            <tbody>
              {electricalData.length > 0 ? (
                electricalData.map((electrical) => (
                  <tr
                    key={electrical.id}
                    onClick={() => handleSelectComponent(electrical)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(electrical.id) && {
                        backgroundColor: "#ff6e2088",
                      }),
                    }}
                  >
                    <td>{electrical.wire_material}</td>
                    <td>{electrical.warranty}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ElectricalWork;
