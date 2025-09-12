import { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setImageUrl(res.data.url);
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Upload Image</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Upload
      </button>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Uploaded" className="max-w-full rounded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;