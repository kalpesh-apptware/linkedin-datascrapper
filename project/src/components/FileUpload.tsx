import { useState, useRef } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or TIFF image');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-25'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/tiff"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        {!selectedFile ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full mb-4 animate-pulse-slow">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your document here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files
            </p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Select File
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Supports JPEG, PNG, TIFF • Max 10MB
            </p>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 p-6 bg-white rounded-xl border-2 border-blue-200 animate-scale-in">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <FileImage className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>

            <button
              onClick={handleUpload}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Process Document
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-1">AI Vision</div>
          <div className="text-sm text-gray-600">Qwen2.5-VL</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl">
          <div className="text-3xl font-bold text-emerald-600 mb-1">Smart</div>
          <div className="text-sm text-gray-600">Profile Extraction</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl">
          <div className="text-3xl font-bold text-orange-600 mb-1">Sheets</div>
          <div className="text-sm text-gray-600">Auto Sync</div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
