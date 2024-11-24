import React, { useState, useEffect } from "react";

const MechanicalWork = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mechanicalData, setMechanicalData] = useState([]);
  const [mechanicalMaterial, setMechanicalMaterial] = useState("");
  const [mechanicalStructureType, setMechanicalStructureType] = useState("");
  const [warranty, setWarranty] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const highlightedIds = components.map((component) => component.id);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://127.0.0.1:8000/api/listings/components/?component_type=Mechanical%20Work",
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
        mechanical_material: item.mechanical_material,
        mechanical_structure_type: item.mechanical_structure_type,
        warranty: item.warranty,
        id: item.id,
      }));

      setMechanicalData(filteredData || []);
    } catch (error) {
      console.error("Error fetching mechanical work data:", error);
      setErrorMessage("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
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
            component_type: "Mechanical Work",
            warranty: warranty.toString(),
            mechanical_material: mechanicalMaterial,
            mechanical_structure_type: mechanicalStructureType,
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

      // Clear input fields
      setMechanicalMaterial("");
      setMechanicalStructureType("");
      setWarranty("");
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
        <h2>Mechanical Work</h2>
        <button className="button" onClick={toggleSection}>
          <ion-icon name={isOpen ? "remove-outline" : "add-outline"}></ion-icon>
        </button>
      </div>

      <div className={`component-body ${isOpen ? "open" : ""}`}>
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="component-input">
          <select
            name="mechanicalMaterial"
            value={mechanicalMaterial}
            onChange={(e) => setMechanicalMaterial(e.target.value)}
          >
            <option value="">Mechanical Material</option>
            <option value="Iron">Iron</option>
            <option value="Aluminium">Aluminium</option>
            <option value="GI">GI</option>
            <option value="PVC">PVC</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="mechanicalStructureType"
            value={mechanicalStructureType}
            onChange={(e) => setMechanicalStructureType(e.target.value)}
          >
            <option value="">Mechanical Structure Type</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="Special">Special</option>
            <option value="Sawtooth">Sawtooth</option>
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
                <th>Mechanical Material</th>
                <th>Mechanical Structure Type</th>
                <th>Warranty</th>
              </tr>
            </thead>
            <tbody>
              {mechanicalData.length > 0 ? (
                mechanicalData.map((mechanical) => (
                  <tr
                    key={mechanical.id}
                    onClick={() => handleSelectComponent(mechanical)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(mechanical.id) && {
                        backgroundColor: "#ff6e2088",
                      }), // Change color if id matches
                    }}
                  >
                    <td>{mechanical.mechanical_material}</td>
                    <td>{mechanical.mechanical_structure_type}</td>
                    <td>{mechanical.warranty}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MechanicalWork;
