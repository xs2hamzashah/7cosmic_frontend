import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline } from "ionicons/icons";

const ComponentDetail = ({ component }) => {
  // Destructure component properties for easier access
  const {
    component_type,
    subtype,
    brand,
    capacity,
    quantity,
    warranty,
    ip_rating,
    details,
    mechanical_material,
    mechanical_structure_type,
    total_backup_capacity,
    civil_material,
    wire_material,
  } = component;

  // Create a formatted object to hold label-value pairs
  const formattedFields = [
    { label: "Subtype", value: subtype },
    { label: "Brand", value: brand },
    { label: "Capacity", value: capacity ? `${capacity} kW` : null },
    { label: "Quantity", value: quantity },
    { label: "Warranty", value: warranty ? `${warranty} Years` : null },
    { label: "IP Rating", value: ip_rating },
    { label: "Specification", value: details },
    { label: "Mechanical Material", value: mechanical_material },
    { label: "Mechanical Structural Type", value: mechanical_structure_type },
    { label: "Total Backup Capacity", value: total_backup_capacity },
    { label: "Civil Material", value: civil_material },
    { label: "Wire Material", value: wire_material },
  ];

  const [showList, setShowList] = useState(true);

  return (
    <div className="component-detail">
      {/* Display component_type as the main heading */}

      {/*
      <h3>{component_type}</h3>
      <ul className="components-list-detail">
        {formattedFields
          .filter((field) => field.value !== null && field.value !== undefined)
          .map((field) => (
            <li
              key={field.label}
              className="flex justify-between items-center border-b border-gray-300 py-2 last:border-b-0"
            >
              <span className="text-gray-600">{field.label}:</span>
              <strong className="mr-20">{field.value}</strong>
            </li>
          ))}
      </ul> 
      */}

      <div className="mb-4">
        {/* Header with Expand/Collapse Button */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            {component_type}
          </h3>
          <button
            onClick={() => setShowList(!showList)}
            className="text-[#ff6f20] text-xl"
          >
            <IonIcon icon={showList ? chevronUpOutline : chevronDownOutline} />
          </button>
        </div>
        {showList && (
          <ul className="components-list-detail mt-2 border border-gray-300 rounded-lg p-2">
            {formattedFields
              .filter(
                (field) => field.value !== null && field.value !== undefined
              )
              .map((field) => (
                <li
                  key={field.label}
                  className="flex justify-between items-center border-b border-gray-300 py-2 last:border-b-0"
                >
                  <span className="text-gray-600">{field.label}:</span>
                  <strong className="mr-4">{field.value}</strong>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Divider for each component */}
      <hr
        style={{ marginTop: "20px", marginBottom: "20px", borderColor: "#ddd" }}
      />
    </div>
  );
};

export default ComponentDetail;
