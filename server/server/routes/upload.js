import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/restaurant-image', upload.single('image'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'restaurant_images' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

export default router;