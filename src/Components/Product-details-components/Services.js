import React from "react";

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
            onClick={() => toggleService("netMetering")}
            className={services.netMetering ? "active" : ""}
          >
            <p>Net Metering File</p>
            {services.netMetering && (
              <ion-icon
                name="checkmark-circle-outline"
                class="checkmark"
              ></ion-icon>
            )}
          </li>
          <li
            onClick={() => toggleService("dcEarthing")}
            className={services.dcEarthing ? "active" : ""}
          >
            <p>DC Earthing</p>
            {services.dcEarthing && (
              <ion-icon
                name="checkmark-circle-outline"
                class="checkmark"
              ></ion-icon>
            )}
          </li>
          <li
            onClick={() => toggleService("onlineMonitoring")}
            className={services.onlineMonitoring ? "active" : ""}
          >
            <p>Online Monitoring</p>
            {services.onlineMonitoring && (
              <ion-icon
                name="checkmark-circle-outline"
                class="checkmark"
              ></ion-icon>
            )}
          </li>
          <li
            onClick={() => toggleService("hseEquipment")}
            className={services.hseEquipment ? "active" : ""}
          >
            <p>HSE Equipment</p>
            {services.hseEquipment && (
              <ion-icon
                name="checkmark-circle-outline"
                class="checkmark"
              ></ion-icon>
            )}
          </li>
          <li>
            <input
              type="number"
              placeholder="Transportation Distance"
              value={transportationDistance}
              onChange={(e) =>
                setTransportationDistance(Math.max(0, e.target.value))
              }
            />
          </li>
          <li>
            <input
              type="number"
              placeholder="AFSS Warranty Years"
              value={afssWarrantyYears}
              onChange={(e) =>
                setAfssWarrantyYears(Math.max(0, e.target.value))
              }
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
