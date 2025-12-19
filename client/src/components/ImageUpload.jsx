import React, { useState } from "react";
import axios from "../services/api";

const ImageUpload = ({ restaurantId }) => {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        "/upload/multiple", // ✅ backend route should handle multiple files
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrls = res.data.urls; // expect array of URLs
      setImageUrls(uploadedUrls);

      // ✅ Attach gallery to restaurant
      await axios.put(
        `/restaurants/${restaurantId}`,
        { imageGallery: uploadedUrls },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Images uploaded and attached to restaurant!");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("❌ Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Upload Restaurant Images</h3>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {imageUrls.map((url, i) => (
            <img key={i} src={url} alt={`Uploaded ${i}`} className="rounded" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;