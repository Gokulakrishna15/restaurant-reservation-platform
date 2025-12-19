import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.post("/restaurant-image/:id", upload.single("image"), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "restaurant_images" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Image upload failed", error: error.message });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
          req.params.id,
          { imageUrl: result.secure_url },
          { new: true }
        );

        res.status(200).json({ imageUrl: result.secure_url, restaurant });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
