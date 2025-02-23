import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { caretUpOutline, caretDownOutline } from "ionicons/icons";
import ComponentDetail from "./ComponentDetail";
import ServicesList from "./ServicesList";
import ImageSlider from "./ImageSlider";
import PhoneNumberPopup from "./PhoneNumberPopup";
import Navbar from "./Navbar";
import API_BASE_URL from "../config";
import "../CSS/ProductDetail.css";
import Spinner from "./Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState();

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listings/solar-solutions/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch package data");

        const data = await response.json();
        setPackageData(data);
        setSellerPhoneNumber(data.company.phone_number);
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

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="body">
      <Navbar />
      <div className="detail flex gap-6">
        {/* Sticky Image Section */}
        <div className="detail-imgs sticky top-4 h-max">
          <ImageSlider packageData={packageData} />

          <ServicesList serviceData={packageData.service} />

          {packageData.seller_note ? (
            <p className="seller-note">
              <span>Note:</span> {packageData.seller_note}
            </p>
          ) : null}
        </div>

        {/* Scrollable Text Section */}
        <div className="text flex-1">
          <h2>{packageData.display_name}</h2>
          <p>
            Price: <span>{packageData.price}M</span>
          </p>
          <p>
            Company: <span>{packageData.company.name}</span>
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
              <IonIcon icon={caretUpOutline} />
            ) : (
              <IonIcon icon={caretDownOutline} />
            )}
          </button>
        </div>
      </div>
      <PhoneNumberPopup
        phoneNumber={sellerPhoneNumber}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        id={id}
      />
    </div>
  );
}
