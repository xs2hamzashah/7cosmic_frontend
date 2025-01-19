import React from "react";

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

  return (
    <div className="component-detail">
      {/* Display component_type as the main heading */}
      <h3>{component_type}</h3>

      <ul className="components-list-detail">
        {/* Filter out fields with null or undefined values and map them */}
        {formattedFields
          .filter((field) => field.value !== null && field.value !== undefined)
          .map((field) => (
            <li key={field.label}>
              {field.label}: <strong>{field.value}</strong>
            </li>
          ))}
      </ul>

      {/* Divider for each component */}
      <hr
        style={{ marginTop: "20px", marginBottom: "20px", borderColor: "#ddd" }}
      />
    </div>
  );
};

export default ComponentDetail;
