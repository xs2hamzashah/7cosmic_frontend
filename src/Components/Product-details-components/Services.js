import React from "react";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";

const Services = ({
  services,
  setServices,
  transportationDistance,
  setTransportationDistance,
  afssWarrantyYears,
  setAfssWarrantyYears,
  additionalNote,
  setAdditionalNote,
}) => {
  const toggleService = (service) => {
    setServices((prevState) => ({
      ...prevState,
      [service]: !prevState[service],
    }));
  };

  return (
    <div className="input-bottom-section">
      <h1>Services</h1>
      <div className="services">
        <ul>
          <li
            onClick={() => toggleService("net_metering_included")}
            className={services.net_metering_included ? "active" : ""}
          >
            <p>Net Metering File</p>
            <IonIcon icon={checkmarkCircleOutline} className="checkmark" />
          </li>
          <li
            onClick={() => toggleService("dc_earthing_included")}
            className={services.dc_earthing_included ? "active" : ""}
          >
            <p>DC Earthing</p>
            <IonIcon icon={checkmarkCircleOutline} className="checkmark" />
          </li>
          <li
            onClick={() => toggleService("online_monitoring_included")}
            className={services.online_monitoring_included ? "active" : ""}
          >
            <p>Online Monitoring</p>
            <IonIcon icon={checkmarkCircleOutline} className="checkmark" />
          </li>
          <li
            onClick={() => toggleService("hse_equipment_included")}
            className={services.hse_equipment_included ? "active" : ""}
          >
            <p>HSE Equipment</p>
            <IonIcon icon={checkmarkCircleOutline} className="checkmark" />
          </li>
          <li>
            <input
              type="number"
              placeholder="Transportation Distance"
              value={transportationDistance}
              onChange={(e) =>
                setTransportationDistance(Math.max(e.target.value))
              }
            />
          </li>
          <li>
            <input
              type="number"
              placeholder="AFSS Warranty Years"
              value={afssWarrantyYears}
              onChange={(e) => setAfssWarrantyYears(Math.max(e.target.value))}
            />
          </li>
        </ul>

        <div className="additional-note">
          <textarea
            placeholder="Additional Note (Optional)"
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Services;
