import React, { useState } from "react";
import axios from "../services/api";

const ImageUpload = ({ onImageUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Call parent callback with uploaded image URL
      if (onImageUploaded && res.data.url) {
        onImageUploaded(res.data.url);
      }

      // Reset form
      setFile(null);
      setPreview(null);
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black border-2 border-cyan-400 rounded-xl p-6">
      <h3 className="text-xl font-bold text-pink-400 mb-4 uppercase">
        📸 Upload Restaurant Image
      </h3>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-cyan-300 mb-2 font-semibold">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-500 file:text-white file:cursor-pointer hover:file:bg-pink-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Supported: JPG, PNG, WebP (Max 5MB)
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <p className="text-cyan-300 mb-2 font-semibold">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-pink-400"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-900 text-red-300 p-3 rounded border border-red-400">
          ❌ {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "⌛ Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUpload;