import React, { useState } from "react";
import ElectricalWork from "../Components/Product-details-components/ElectricalWork";
import MechanicalWork from "../Components/Product-details-components/MechanicalWork";
import CivilWork from "../Components/Product-details-components/CivilWork";
import Battery from "../Components/Product-details-components/Battery";
import Inverter from "../Components/Product-details-components/Inverter";
import SolarPanel from "../Components/Product-details-components/SolarPanel";
import Services from "../Components/Product-details-components/Services";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailList = () => {
  const [components, setComponents] = useState([]);
  const [services, setServices] = useState({
    netMetering: false,
    dcEarthing: false,
    onlineMonitoring: false,
    hseEquipment: false,
    transportation: false,
  });
  const [transportationDistance, setTransportationDistance] = useState("");
  const [afssWarrantyYears, setAfssWarrantyYears] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSelectComponent = (component) => {
    const componentIndex = components.findIndex(
      (comp) => comp.id === component.id
    );

    let updatedComponents;
    if (componentIndex === -1) {
      // If component is not in the list, add it
      updatedComponents = [...components, component];
    } else {
      // If component is already in the list, remove it
      updatedComponents = components.filter((comp) => comp.id !== component.id);
    }

    setComponents(updatedComponents);
  };

  const updateServer = async () => {
    const componentIds = components.map((comp) => comp.id);

    const servicePayload = {
      service: {
        dc_earthing_included: services.dcEarthing,
        afss_included: services.afss,
        afss_warranty_years: parseInt(afssWarrantyYears, 10) || 0,
        online_monitoring_included: services.onlineMonitoring,
        net_metering_included: services.netMetering,
        hse_equipment_included: services.hseEquipment,
        transportation_included: services.transportation,
        transportation_distance: parseInt(transportationDistance, 10) || 0,
      },
      seller_note: additionalNote,
      component_ids: componentIds,
    };

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authorization token not found. Please log in again.");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/listings/solar-solutions/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicePayload),
        }
      );

      if (response.ok) {
        console.log("Package updated successfully");
        navigate(`/product-image-upload/${id}`);
      } else {
        throw new Error("Failed to update components and services");
      }
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  return (
    <div className="component-detail-page">
      <h1>Components</h1>

      <SolarPanel
        components={components}
        handleSelectComponent={handleSelectComponent}
      />
      <Inverter
        components={components}
        handleSelectComponent={handleSelectComponent}
      />
      <Battery
        components={components}
        handleSelectComponent={handleSelectComponent}
      />
      <ElectricalWork
        components={components}
        handleSelectComponent={handleSelectComponent}
      />
      <MechanicalWork
        components={components}
        handleSelectComponent={handleSelectComponent}
      />
      <CivilWork
        components={components}
        handleSelectComponent={handleSelectComponent}
      />

      <Services
        services={services}
        setServices={setServices}
        transportationDistance={transportationDistance}
        setTransportationDistance={setTransportationDistance}
        afssWarrantyYears={afssWarrantyYears}
        setAfssWarrantyYears={setAfssWarrantyYears}
        additionalNote={additionalNote}
        setAdditionalNote={setAdditionalNote}
      />

      <button className="comp-sending-btn" onClick={updateServer}>
        Submit All
      </button>
    </div>
  );
};

export default ProductDetailList;
