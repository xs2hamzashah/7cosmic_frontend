import React, { useState, useEffect } from "react";

const CivilWork = ({ components, handleSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [civilData, setCivilData] = useState([]);
  const [civilMaterial, setCivilMaterial] = useState("");
  const [warranty, setWarranty] = useState("");

  const highlightedIds = components.map((component) => component.id);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://127.0.0.1:8000/api/listings/components/?component_type=Civil%20Work",
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
        civil_material: item.civil_material,
        warranty: item.warranty,
        id: item.id,
      }));

      setCivilData(filteredData || []);
    } catch (error) {
      console.error("Error fetching civil work data:", error);
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
            component_type: "Civil Work",
            warranty: warranty.toString(),
            civil_material: civilMaterial,
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
      setCivilMaterial("");
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
        <h2>Civil Work</h2>
        <button className="button" onClick={toggleSection}>
          <ion-icon name={isOpen ? "remove-outline" : "add-outline"}></ion-icon>
        </button>
      </div>

      <div className={`component-body ${isOpen ? "open" : ""}`}>
        <div className="component-input">
          <select
            name="civilMaterial"
            value={civilMaterial}
            onChange={(e) => setCivilMaterial(e.target.value)}
          >
            <option value="">Civil Material</option>
            <option value="Concrete">Concrete</option>
            <option value="Curbstone">Curbstone</option>
            <option value="Brick">Brick</option>
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
                <th>Material Type</th>
                <th>Warranty</th>
              </tr>
            </thead>
            <tbody>
              {civilData.length > 0 ? (
                civilData.map((civil) => (
                  <tr
                    key={civil.id}
                    onClick={() => handleSelectComponent(civil)}
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(civil.id) && {
                        backgroundColor: "#ff6e2088",
                      }), // Change color if id matches
                    }}
                  >
                    <td>{civil.civil_material}</td>
                    <td>{civil.warranty}</td>
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

export default CivilWork;
