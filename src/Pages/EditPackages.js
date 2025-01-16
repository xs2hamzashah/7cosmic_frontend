import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import axios from "axios";
import API_BASE_URL from "../config";
import AddPackageForm from "./AddPackageForm";
import ProductDetailList from "./ProductDetailsList";
import Spinner from "../Components/Spinner";

const EditPackage = () => {
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
        setPackageData(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error.response?.data);
      }
    };

    if (id) fetchPackageDetails();
  }, [id]);

  const handlePackageUpdate = async (updatedPackage) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/`,
        updatedPackage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Package updated successfully");
        navigate(`/product-image-upload/${id}`);
      }
    } catch (error) {
      console.error("Error updating package:", error.response?.data);
    }
  };

  if (!packageData) return <Spinner />;

  return (
    <div id="body" className="edit-package-page">
      {/* AddPackageForm appears at the top for editing */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <IonIcon icon={arrowBackOutline} />
        Back
      </button>
      <AddPackageForm
        mode="edit"
        packageData={packageData}
        packageId={id}
        onUpdate={handlePackageUpdate}
      />

      {/* ProductDetailList for managing components, services, etc. */}
      <ProductDetailList
        role="admin"
        components={packageData.components}
        services={packageData.service}
        packageId={id}
      />
    </div>
  );
};

export default EditPackage;
