import React from "react";

export default function ServicesList({ serviceData }) {
  const serviceLabels = {
    dc_earthing_included: "DC Earthing",
    afss_included: "AFF",
    afss_warranty_years: "AFF Warranty",
    online_monitoring_included: "Online Monitoring",
    net_metering_included: "Net Metering",
    hse_equipment_included: "HSE Equipment",
    transportation_included: "Transportation",
    transportation_distance: "Transportation Distance",
  };

  const formatServiceItem = (key, value) => {
    switch (key) {
      case "afss_included":
        return value ? serviceLabels[key] : null;
      case "afss_warranty_years":
        return value > 0 ? `${serviceLabels[key]}: ${value} years` : null;
      case "transportation_distance":
        return value > 0 ? `${serviceLabels[key]}: ${value} KM` : null;
      default:
        return value ? serviceLabels[key] : null;
    }
  };

  const serviceList = Object.entries(serviceData || {})
    .map(([key, value]) => formatServiceItem(key, value))
    .filter(Boolean);

  return (
    <div className="service-list">
      <h3>Services</h3>
      {serviceList.length > 0 ? (
        <ul>
          {serviceList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No services available</p>
      )}
    </div>
  );
}
