import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ComponentDetail from "./ComponentDetail";
import ServicesList from "./ServicesList";
import ImageSlider from "./ImageSlider";
import PhoneNumberPopup from "./PopUp";
import '../CSS/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/listings/solar-solutions/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch package data");

        const data = await response.json();
        setPackageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="detail">
      <div className="detail-imgs">
        <ImageSlider packageData={packageData} />

        <ServicesList serviceData={packageData.service} />

        {packageData.seller_note ? (
          <p className="seller-note">
            <span>Note:</span> {packageData.seller_note}
          </p>
        ) : null}
      </div>

      <div className="text">
        <h2>{packageData.display_name}</h2>
        <p>
          Price: <span>{packageData.price}M</span>
        </p>
        <p>
          Size: <span>{packageData.size}</span>
        </p>
        <p>
          Type: <span>{packageData.solution_type}</span>
        </p>

        <button className="detail-btn" onClick={handleOpenPopup}>
          Whatsapp
        </button>

        <h2 className="center-text">Components</h2>
        <div className={`component-list ${expanded ? "expanded" : ""}`}>
          {packageData.components.map((component) => (
            <ComponentDetail key={component.id} component={component} />
          ))}
        </div>

        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ion-icon name="caret-up-outline"></ion-icon>
          ) : (
            <ion-icon name="caret-down-outline"></ion-icon>
          )}
        </button>
      </div>
      <PhoneNumberPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}
