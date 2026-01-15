import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ✅ FIXED: Simplified upload route
router.post("/restaurant-image", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: "restaurant_images",
        transformation: [
          { width: 800, height: 600, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ 
            message: "Image upload failed", 
            error: error.message 
          });
        }

        res.status(200).json({ 
          success: true,
          imageUrl: result.secure_url,
          message: "Image uploaded successfully"
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      message: "Upload failed", 
      error: err.message 
    });
  }
});

export default router;