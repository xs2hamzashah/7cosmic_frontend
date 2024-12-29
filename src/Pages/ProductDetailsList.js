import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ElectricalWork from "../Components/Product-details-components/ElectricalWork";
import MechanicalWork from "../Components/Product-details-components/MechanicalWork";
import CivilWork from "../Components/Product-details-components/CivilWork";
import Battery from "../Components/Product-details-components/Battery";
import Inverter from "../Components/Product-details-components/Inverter";
import SolarPanel from "../Components/Product-details-components/SolarPanel";
import Services from "../Components/Product-details-components/Services";
import API_BASE_URL from "../config";
import "../CSS/ProductComponentsInputs.css";

const ProductDetailList = () => {
  const [components, setComponents] = useState([]);
  const [services, setServices] = useState({});
  const [transportationDistance, setTransportationDistance] = useState("");
  const [afssWarrantyYears, setAfssWarrantyYears] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [packageData, setPackageData] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/listings/solar-solutions/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = response.data;
        setPackageData(data);
        setComponents(data.components || []);
        setServices(data.service || {});
        setTransportationDistance(data.service?.transportation_distance || "");
        setAfssWarrantyYears(data.service?.afss_warranty_years || "");
        setAdditionalNote(data.seller_note || "");
      } catch (error) {
        console.error("Error fetching package details:", error.response?.data);
      }
    };

    if (id) fetchPackageDetails();
  }, [id]);

  const handleSelectComponent = (component) => {
    const componentIndex = components.findIndex(
      (comp) => comp.id === component.id
    );

    let updatedComponents;
    if (componentIndex === -1) {
      updatedComponents = [...components, component];
    } else {
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
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/`,
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

  if (!packageData && id) {
    return <div>Loading...</div>;
  }

  return (
    <div id="body" className="component-detail-page">
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
        Next
      </button>
    </div>
  );
};

export default ProductDetailList;
