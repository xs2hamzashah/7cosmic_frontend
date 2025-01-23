import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PackageEditor from "../Components/PackageEditor";
import ProductDetailList from "./ProductDetailsList";
import Spinner from "../Components/Spinner";

const EditPackage = () => {
  const [packageData, setPackageData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState();
  const [size, setSize] = useState();
  const [solutionType, setSolutionType] = useState();

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
        setPrice(response.data.price);
        setSize(response.data.size);
        setSolutionType(response.data.solution_type);
      } catch (error) {
        console.error("Error fetching package details:", error.response?.data);
      }
    };

    if (id) fetchPackageDetails();
  }, [id]);

  const handlePackageUpdate = async (price, size, solutionType) => {
    try {
      // Wrap the values in an object to match the API's expectations
      const updatedPackage = {
        price,
        size,
        solution_type: solutionType,
      };

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
        toast.success("Package updated successfully");
      }
    } catch (error) {
      console.error("Error updating package:", error.response?.data);
    }
  };

  if (!packageData) return <Spinner />;

  return (
    <div id="body" className="edit-package-page">
      <ToastContainer />
      {/* AddPackageForm appears at the top for editing */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <IonIcon icon={arrowBackOutline} />
        Back
      </button>
      <PackageEditor
        mode="edit"
        price={price}
        size={size}
        solutionType={solutionType}
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

      <button
        onClick={() => navigate(-1)}
        className="bg-[#ff6f20] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#e65e1a] hover:shadow-lg active:scale-95 transition transform duration-200"
      >
        Back
      </button>
    </div>
  );
};

export default EditPackage;
