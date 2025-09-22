import React, { useState, useRef } from "react";

export default function LogoPage() {
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [logoAssignments, setLogoAssignments] = useState({
    header: null,
    footer: null,
    favicon: null,
    mobileHeader: null,
    mobileFooter: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const logoTypes = [
    { key: 'header', label: 'Header', icon: '🏠', description: 'Main website header logo' },
    { key: 'footer', label: 'Footer', icon: '⬇️', description: 'Website footer logo' },
    { key: 'favicon', label: 'Favicon', icon: '🔖', description: 'Browser tab icon (16x16 or 32x32)' },
    { key: 'mobileHeader', label: 'Mobile Header', icon: '📱', description: 'Mobile version header logo' },
    { key: 'mobileFooter', label: 'Mobile Footer', icon: '📲', description: 'Mobile version footer logo' }
  ];

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = {
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toLocaleDateString()
        };
        setUploadedLogo(logoData);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG, JPG, JPEG, GIF, SVG)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const assignLogoToType = (logoType) => {
    if (uploadedLogo) {
      setLogoAssignments(prev => ({
        ...prev,
        [logoType]: uploadedLogo
      }));
    }
  };

  const removeLogoFromType = (logoType) => {
    setLogoAssignments(prev => ({
      ...prev,
      [logoType]: null
    }));
  };

  const clearAllLogos = () => {
    setLogoAssignments({
      header: null,
      footer: null,
      favicon: null,
      mobileHeader: null,
      mobileFooter: null
    });
  };

  const deleteUploadedLogo = () => {
    setUploadedLogo(null);
    clearAllLogos();
    setShowDeleteConfirm(null);
  };

  const editLogoAssignment = (logoType) => {
    setEditingLocation(logoType);
  };

  const confirmDeleteLocation = (logoType) => {
    setShowDeleteConfirm(logoType);
  };

  const deleteLogoFromLocation = (logoType) => {
    removeLogoFromType(logoType);
    setShowDeleteConfirm(null);
  };

  const replaceLogoForLocation = (logoType, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = {
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toLocaleDateString()
        };
        
        // Update assignments for this specific location
        setLogoAssignments(prev => ({
          ...prev,
          [logoType]: logoData
        }));
        setEditingLocation(null);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG, JPG, JPEG, GIF, SVG)');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-left text-gray-800">Logo</h1>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Upload Logo</h2>
          
          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ${
              dragActive 
                ? 'border-gray-500 bg-gray-100' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {uploadedLogo ? (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <img 
                    src={uploadedLogo.url} 
                    alt="Uploaded logo" 
                    className="max-w-xs max-h-32 object-contain rounded"
                  />
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-medium">{uploadedLogo.name}</p>
                  <p>{formatFileSize(uploadedLogo.size)} • {uploadedLogo.type}</p>
                  <p>Uploaded: {uploadedLogo.uploadDate}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    Replace Logo
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm('main')}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
                  >
                    Delete Logo
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4"></div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Upload Your Logo</h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your logo file here, or click to select
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Choose File
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Supports PNG, JPG, JPEG, GIF, SVG
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logo Assignment Section */}
        {uploadedLogo && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Assign Logo to Locations</h2>
              <button
                onClick={clearAllLogos}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logoTypes.map(({ key, label, icon, description }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition duration-200">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{label}</h3>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                  
                  {logoAssignments[key] ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <img 
                          src={logoAssignments[key].url} 
                          alt={`${label} logo`}
                          className="max-w-full max-h-16 object-contain mx-auto mb-2"
                        />
                        <p className="text-sm text-gray-700 text-center">
                          ✓ Logo assigned
                        </p>
                      </div>
                      
                      {editingLocation === key ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                replaceLogoForLocation(key, e.target.files[0]);
                              }
                            }}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingLocation(null)}
                              className="flex-1 bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-200 transition duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => editLogoAssignment(key)}
                            className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteLocation(key)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => assignLogoToType(key)}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                    >
                      Assign Logo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

       

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Delete
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {showDeleteConfirm === 'main' 
                  ? 'Are you sure you want to delete the uploaded logo? This will remove it from all locations.'
                  : `Are you sure you want to remove the logo from ${logoTypes.find(t => t.key === showDeleteConfirm)?.label}?`
                }
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => showDeleteConfirm === 'main' ? deleteUploadedLogo() : deleteLogoFromLocation(showDeleteConfirm)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
