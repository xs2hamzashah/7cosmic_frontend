import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { IonIcon } from "@ionic/react";
import { closeOutline, arrowBackOutline } from "ionicons/icons";
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
  const [displayName, setDisplayName] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [componentsSaved, setComponentsSaved] = useState(false);

  // Image upload states
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false); // Changed initial state to false
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/listings/solar-solutions/${id}/`
        );
        const data = response.data;
        setDisplayName(data.display_name);
      } catch (error) {
        console.error(
          "Error fetching display name:",
          error.response?.data || error.message
        );
      }
    };

    if (id) {
      fetchDisplayName();
    }
  }, [id]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setIsLoading(true);
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

        // Set existing images if available
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(
            data.images.map((img, index) => ({
              ...img,
              isDisplay: img.is_display_image,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching package details:", error.response?.data);
      } finally {
        setIsLoading(false);
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

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setSelectedIndex(null);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    if (selectedIndex === indexToRemove) setSelectedIndex(null);
  };

  const handleRemoveExistingImage = async (imageId) => {
    try {
      const formData = new FormData();
      formData.append("image_id", imageId);

      await axios.delete(
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/update_media/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData, // Pass the form data as the body of the request
        }
      );

      setExistingImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSetDisplayImage = async (imageId) => {
    setIsLoadingImages(true);
    try {
      const formData = new FormData();
      formData.append("image_id", imageId);
      formData.append("is_display_image", true);

      await axios.patch(
        `${API_BASE_URL}/api/listings/solar-solutions/${id}/update_media/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setExistingImages((prevImages) =>
        prevImages.map((img) => ({
          ...img,
          isDisplay: img.id === imageId,
        }))
      );
    } catch (error) {
      console.error("Error setting display image:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleImageUpload = async () => {
    if (files.length === 0) {
      console.error("No files to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file, index) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("is_display_image", index === selectedIndex);

        return axios.post(
          `${API_BASE_URL}/api/listings/solar-solutions/${id}/upload_media/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      });

      const responses = await Promise.all(uploadPromises);
      console.log(
        "Upload successful:",
        responses.map((res) => res.data)
      );

      // Navigate based on edit mode
      navigate(isEditMode ? -1 : -2);
    } catch (error) {
      console.error(
        "Error uploading images:",
        error.response?.data || error.message
      );
    } finally {
      setIsUploading(false);
    }
  };

  const updateServer = async () => {
    setIsSaving(true);
    const componentIds = components.map((comp) => comp.id);

    const servicePayload = {
      service: {
        dc_earthing_included: services.dc_earthing_included,
        afss_included: services.afss,
        afss_warranty_years: parseInt(afssWarrantyYears, 10) || 0,
        online_monitoring_included: services.online_monitoring_included,
        net_metering_included: services.net_metering_included,
        hse_equipment_included: services.hse_equipment_included,
        transportation_included: Boolean(
          transportationDistance && transportationDistance.trim() !== ""
        ),
        transportation_distance:
          transportationDistance && transportationDistance.trim() !== ""
            ? parseInt(transportationDistance, 10)
            : 0,
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
        setComponentsSaved(true);
      } else {
        throw new Error("Failed to update components and services");
      }
    } catch (error) {
      console.error("Error updating package:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="body" className="component-detail-page">
      {!isEditMode && (
        <button className="back-button" onClick={() => navigate(-2)}>
          <IonIcon icon={arrowBackOutline} />
          Back
        </button>
      )}
      <h2 className="text-4xl font-medium text-center mt-10 mb-10 text-[#ff6f20]">
        {displayName}
      </h2>

      {/* Components Section */}
      <div className="space-y-6 mb-8">
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

        <button
          className={`comp-sending-btn relative ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={updateServer}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Components"
          )}
        </button>
      </div>

      {/* Image Upload Section - Only shown after components are saved */}
      {componentsSaved && (
        <div className="p-6 bg-gray-100 rounded-lg mt-12">
          <h2 className="text-2xl font-bold text-center text-[#FF6F20] mb-4">
            Upload Your Images
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Choose photos for your listing and select one as the main display
            image.
          </p>

          <div className="flex flex-col items-center">
            <label
              htmlFor="fileUpload"
              className="px-6 py-3 bg-[#FF6F20] text-white font-semibold rounded-lg cursor-pointer hover:bg-[#e65a14] transition"
            >
              Choose Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              id="fileUpload"
              className="hidden"
            />
          </div>

          {/* Existing Images Section */}
          {isEditMode && existingImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Existing Images
              </h3>
              <div className="flex flex-wrap gap-4 p-4 border border-gray-300 rounded-lg bg-white">
                {isLoadingImages ? (
                  // Loading skeleton
                  <>
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="relative w-32 h-24 bg-gray-200 rounded-md animate-pulse"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    ))}
                  </>
                ) : (
                  // Actual images
                  existingImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative group border ${
                        image.isDisplay ? "border-[#FF6F20]" : "border-gray-300"
                      } rounded-lg overflow-hidden shadow-md`}
                    >
                      <img
                        src={image.image_url || image.url || image.image}
                        alt={`Image ${image.id}`}
                        className="w-32 h-24 object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="absolute top-1 right-1 bg-white text-red-500 border border-red-500 rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-sm group-hover:opacity-100 opacity-0 transition"
                      >
                        <IonIcon icon={closeOutline} />
                      </button>
                      {!image.isDisplay && (
                        <button
                          onClick={() => handleSetDisplayImage(image.id)}
                          className="absolute bottom-1 left-1 text-xs text-[#FF6F20] bg-white px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition"
                        >
                          Set as Display
                        </button>
                      )}
                      {image.isDisplay && (
                        <p className="absolute bottom-1 left-1 text-xs text-white bg-[#FF6F20] px-2 py-0.5 rounded-md">
                          Display Image
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* New Images Section */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                New Images
              </h3>
              <div className="flex flex-wrap gap-4 p-4 border border-gray-300 rounded-lg bg-white">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`relative group border ${
                      index === selectedIndex
                        ? "border-[#FF6F20]"
                        : "border-gray-300"
                    } rounded-lg overflow-hidden shadow-md cursor-pointer`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 bg-white text-red-500 border border-red-500 rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-sm group-hover:opacity-100 opacity-0 transition"
                    >
                      <IonIcon icon={closeOutline} />
                    </button>
                    {index === selectedIndex && (
                      <p className="absolute bottom-1 left-1 text-xs text-white bg-[#FF6F20] px-2 py-0.5 rounded-md">
                        Display Image
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleImageUpload}
            className={`w-full mt-6 px-8 py-3 bg-[#FF6F20] text-white font-bold rounded-lg hover:bg-[#e65a14] transition ${
              isUploading || files.length === 0
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              "Upload Photos"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailList;
