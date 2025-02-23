import React, { useState, useEffect } from "react";

import { IonIcon } from "@ionic/react";
import {
  removeOutline,
  addOutline,
  addCircleOutline,
  removeCircleOutline,
} from "ionicons/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API_BASE_URL from "../../config";

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
        `${API_BASE_URL}/api/listings/components/?component_type=Civil%20Work`,
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
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!civilMaterial || !warranty) {
      toast.error("Both Civil Material and Warranty are required.");
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
            component_type: "Civil Work",
            warranty: warranty.toString(),
            civil_material: civilMaterial,
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

      // Clear input fields after submission
      setWarranty("");
      setCivilMaterial("");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="roller">
      <ToastContainer />
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
            type="number"
            placeholder="Warranty"
            value={warranty}
            onChange={(e) => setWarranty(Math.max(0, e.target.value))}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {civilData.length > 0 ? (
                civilData.map((civil) => (
                  <tr
                    key={civil.id}
                    className={
                      highlightedIds.includes(civil.id) ? "bg-green-50" : ""
                    }
                    style={{
                      cursor: "pointer",
                      ...(highlightedIds.includes(civil.id) && {
                        backgroundColor: "#ff6e2088",
                      }),
                    }}
                  >
                    <td>{civil.civil_material}</td>
                    <td>{civil.warranty}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectComponent(civil);
                          setIsOpen(false);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          highlightedIds.includes(civil.id)
                            ? "hover:bg-red-50 focus:ring-red-500"
                            : "hover:bg-green-50 focus:ring-green-500"
                        }`}
                      >
                        {highlightedIds.includes(civil.id) ? (
                          <IonIcon
                            icon={removeCircleOutline}
                            className="w-6 h-6 transition-transform duration-200"
                            color="#dc2626"
                            style={{
                              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                            }}
                          />
                        ) : (
                          <IonIcon
                            icon={addCircleOutline}
                            className="w-6 h-6 transition-transform duration-200"
                            color="#16a34a"
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
                  <td colSpan="3">No data available</td>{" "}
                  {/* Updated colspan to 3 for the new action column */}
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
