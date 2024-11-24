import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ImageUploader = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 3);
    setFiles(selectedFiles);
    setSelectedIndex(null);
  };

  // Upload images to the server
  const handleUpload = async () => {
    try {
      const uploadPromises = files.map((file, index) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("is_display_image", index === selectedIndex);

        return axios.post(
          `http://127.0.0.1:8000/api/listings/solar-solutions/${id}/upload_media/`,
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

      // Reset files and selectedIndex after successful upload
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
    <div className="image-uploader">
      <h2>Upload Images</h2>
      <div className="image-uploader-btn">
        {/* Actual file input, hidden */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          id="fileUpload"
          style={{ display: "none" }} // Hide the actual file input
        />
        <ion-icon name="cloud-upload-outline"></ion-icon>

        {/* Label as a styled button */}
        <label htmlFor="fileUpload">Choose Files</label>
      </div>
      <div className="image-previews" style={{ display: "flex", gap: "10px" }}>
        {files.map((file, index) => (
          <div
            key={index}
            className={`image-preview ${
              index === selectedIndex ? "selected" : ""
            }`}
            onClick={() => setSelectedIndex(index)}
            style={{
              border:
                index === selectedIndex ? "2px solid blue" : "1px solid gray",
              padding: "5px",
            }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="img-preview"
            />
          </div>
        ))}
      </div>
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Import
      </button>
    </div>
  );
};

export default ImageUploader;
