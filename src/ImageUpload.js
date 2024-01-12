import React, { useState } from 'react';

const ImageUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const base64String = await convertToBase64(file);
      onFileSelect(base64String);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Preview" />}
    </div>
  );
};

export default ImageUpload;