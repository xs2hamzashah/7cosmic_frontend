import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import API_BASE_URL from "../../config";

const ImageUploader = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error("No files to upload.");
      return;
    }

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

      setFiles([]);
      setSelectedIndex(null);
    } catch (error) {
      console.error(
        "Error uploading images:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center text-[#FF6F20] mb-4">
        Upload Your Images
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Choose photos for your listing and select one as the main display image.
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

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6 p-4 border border-gray-300 rounded-lg bg-white">
          {files.map((file, index) => (
            <div
              key={index}
              className={`relative group border ${
                index === selectedIndex ? "border-[#FF6F20]" : "border-gray-300"
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
      )}

      <button
        onClick={handleUpload}
        className="mt-6 px-8 py-3 bg-[#FF6F20] text-white font-bold rounded-lg hover:bg-[#e65a14] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={files.length === 0}
      >
        Upload Photos
      </button>
    </div>
  );
};

export default ImageUploader;
