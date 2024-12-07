import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const ImageUploader = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Load files from local storage when the component mounts
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setSelectedIndex(null);
  };
  

  // Upload all images to the server
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

      // Clear local storage and state after successful upload
      localStorage.removeItem("uploadedFiles");
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
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          id="fileUpload"
          style={{ display: "none" }}
        />
        <label htmlFor="fileUpload">Choose Files</label>
      </div>

      {/* Display previews in a row */}
      {files.length > 0 && (
        <div
          className="image-showcase"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "10px",
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: "100%",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              className={`image-preview ${
                index === selectedIndex ? "selected" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              style={{
                flex: "0 0 auto",
                cursor: "pointer",
                border:
                  index === selectedIndex ? "2px solid #FF6F20" : "1px solid gray",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                style={{
                  maxWidth: "150px",
                  maxHeight: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              {index === selectedIndex && (
                <p
                  style={{
                    color: "#FF6F20",
                    textAlign: "center",
                    margin: "5px 0 0",
                  }}
                >
                  Display Image
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#FF6F20",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        disabled={files.length === 0}
      >
        Import
      </button>
    </div>
  );
};

export default ImageUploader;
