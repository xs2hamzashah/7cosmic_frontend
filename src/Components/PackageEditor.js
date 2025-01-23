import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import "../CSS/EditPackageForm.css";

const PackageEditor = ({ price, size, solutionType, onUpdate }) => {
  const [priceValue, setPriceValue] = useState(price || "");
  const [sizeValue, setSizeValue] = useState(size || "");
  const [solutionTypeValue, setSolutionTypeValue] = useState(
    solutionType || "On-Grid"
  );
  const [validationError, setValidationError] = useState("");

  const validateFields = () => {
    if (String(priceValue).trim() === "" || String(sizeValue).trim() === "") {
      setValidationError("Both price and size fields must be filled.");
      return false;
    }

    const priceInt = parseInt(priceValue, 10);
    if (isNaN(priceInt) || priceInt < 100000) {
      setValidationError("Price must be at least 1 lac (100,000).");
      return false;
    }
    if (priceInt % 1000 !== 0) {
      setValidationError("Price must be a multiple of 1000.");
      return false;
    }

    const sizeInt = parseInt(sizeValue, 10);
    if (isNaN(sizeInt) || sizeInt < 3) {
      setValidationError("Package Size must be at least 3 kW.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    // Fire the onUpdate function with three separate values
    onUpdate(priceValue, sizeValue, solutionTypeValue);
  };

  return (
    <section id="body" className="editing-package">
      <h1 className="main-text">Edit Package</h1>

      <div className="form">
        <input
          type="number"
          placeholder="Price (PKR)"
          name="price"
          value={priceValue}
          onChange={(e) => setPriceValue(e.target.value)}
          className="price-input"
        />
        <input
          type="number"
          placeholder="Package Size (kW)"
          name="size"
          value={sizeValue}
          onChange={(e) => setSizeValue(e.target.value)}
          className="size-input"
        />
        <select
          name="solution_type"
          value={solutionTypeValue}
          onChange={(e) => setSolutionTypeValue(e.target.value)}
          className="solution-type-input"
        >
          <option value="On-Grid">On-Grid</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <button type="button" onClick={handleSubmit} className="save-button">
          <IonIcon icon={checkmarkOutline} />
        </button>
      </div>

      {validationError && <p className="error">{validationError}</p>}
    </section>
  );
};

export default PackageEditor;
