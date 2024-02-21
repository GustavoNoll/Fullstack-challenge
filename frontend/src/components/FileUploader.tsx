import React, { ChangeEvent, useEffect, useState } from 'react';
import config from '../config'
import axios from 'axios'

interface FileUploaderProps {
  onUploadSuccess: () => void;
}


const FileUploader: React.FC<FileUploaderProps> = ({  onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileType = file.type.toLowerCase();
      if (fileType !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please select a CSV file.');
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post(`${config.backendUrl}${config.endpoints.files}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error:', error.response.data.message);
          alert(error.response.data.message);
        } else {
          console.error('Error:', error.message);
          alert(error.message);
        }
      } else {
        console.error('Unexpected error:', error);
        alert(error);
      }
      setSelectedFile(null)
    }

  };

  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  return (
    <div>
      <label htmlFor="file-upload" className="file-label">{selectedFile?.name ?? 'Upload a file'}</label>
      <input id="file-upload" className="file-input" type="file" onChange={handleFileChange}/>
    </div>
  );
};

export default FileUploader;
