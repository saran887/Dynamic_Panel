import React, { useState, useRef } from "react";
import { 
  MenuSquare,
  ArrowDown, 
  Bookmark, 
  Smartphone, 
  TabletSmartphone,
  Layout,
  ChevronDown,
  Monitor,
  Image
} from "lucide-react";

const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);
    
    // Cleanup function to prevent memory leaks
    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };
    
    img.onload = () => {
      cleanup();
      
      // Calculate dimensions
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio while resizing
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }

      // Create canvas and resize the image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob and create new file
      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });

          resolve({
            file: resizedFile,
            width,
            height,
            dataUrl: canvas.toDataURL(file.type)
          });
        },
        file.type
      );
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
};

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
  const mainLogoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const logoTypes = [
    { key: 'header', label: 'Header', icon: MenuSquare, description: 'Main website header logo' },
    { key: 'footer', label: 'Footer', icon: Monitor, description: 'Website footer logo' },
    { key: 'mobileHeader', label: 'Mobile Header', icon: Smartphone, description: 'Mobile version header logo' },
    { key: 'mobileFooter', label: 'Mobile Footer', icon: TabletSmartphone, description: 'Mobile version footer logo' }
  ];

  const validateMainLogo = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!file) return { valid: false, message: 'No file selected' };
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Please upload a valid image file (PNG, JPG, JPEG, GIF, SVG)' };
    }
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, message: 'File size should be less than 5MB' };
    }
    return { valid: true };
  };

  const handleMainLogoUpload = async (file, specificLocation = null) => {
    const validation = validateMainLogo(file);
    if (validation.valid) {
      try {
        // Resize image if it's too large (max 1200x1200)
        const resized = await resizeImage(file, 1200, 1200);
        
        const logoData = {
          file: resized.file,
          url: resized.dataUrl,
          name: file.name,
          size: resized.file.size,
          type: file.type,
          dimensions: `${resized.width}x${resized.height}`,
          uploadDate: new Date().toLocaleDateString()
        };
        
        // If replacing a specific location's logo
        if (specificLocation) {
          setLogoAssignments(prev => ({
            ...prev,
            [specificLocation]: logoData
          }));
        } else {
          // Normal upload - set as main logo and update all assignments
          setUploadedLogo(logoData);
          
          // Update all assigned locations except favicon with the new logo
          setLogoAssignments(prev => {
            const updatedAssignments = { ...prev };
            Object.keys(prev).forEach(key => {
              if (prev[key] !== null && key !== 'favicon') {
                updatedAssignments[key] = logoData;
              }
            });
            return updatedAssignments;
          });
        }
      } catch (error) {
        alert('Error processing image. Please try another file.');
        console.error('Error resizing image:', error);
      }
    } else {
      alert(validation.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleMainLogoUpload(e.dataTransfer.files[0]);
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

  const handleFaviconUpload = async (file) => {
    if (!file) return;
    
    const validateFavicon = (file) => {
      if (!file) return { valid: false, message: 'No file selected' };
      if (file.type !== 'image/svg+xml' && file.type !== 'image/png') {
        return { valid: false, message: 'Please upload only SVG or PNG files for favicon' };
      }
      if (file.size > 500 * 1024) {
        return { valid: false, message: 'Favicon size should be less than 500KB' };
      }
      return { valid: true };
    };

    const validation = validateFavicon(file);
    if (validation.valid) {
      try {
        let logoData;
        // Don't resize SVG files
        if (file.type === 'image/svg+xml') {
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onload = (e) => {
              logoData = {
                file: file,
                url: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toLocaleDateString()
              };
              setLogoAssignments(prev => ({
                ...prev,
                favicon: logoData
              }));
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } else {
          // Resize PNG files to 32x32
          const resized = await resizeImage(file, 32, 32);
          logoData = {
            file: resized.file,
            url: resized.dataUrl,
            name: file.name,
            size: resized.file.size,
            type: file.type,
            dimensions: `${resized.width}x${resized.height}`,
            uploadDate: new Date().toLocaleDateString()
          };
          setLogoAssignments(prev => ({
            ...prev,
            favicon: logoData
          }));
        }
      } catch (error) {
        alert('Error processing favicon. Please try another file.');
        console.error('Error processing favicon:', error);
      }
    } else {
      alert(validation.message);
    }
  };

  const handleFaviconInput = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      await handleFaviconUpload(file);
    }
  };

  const handleMainLogoInput = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      handleMainLogoUpload(file);
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

  const clearAllLogos = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLogoAssignments(prev => {
      const newState = { ...prev };
      // Only clear non-favicon assignments
      ['header', 'footer', 'mobileHeader', 'mobileFooter'].forEach(key => {
        newState[key] = null;
      });
      return newState;
    });
  };

  const deleteUploadedLogo = () => {
    setUploadedLogo(null);
    setLogoAssignments(prev => ({
      ...prev,
      header: null,
      footer: null,
      mobileHeader: null,
      mobileFooter: null,
      // Keep favicon state unchanged
      favicon: prev.favicon
    }));
    setShowDeleteConfirm(null);
  };

  const editLogoAssignment = (logoType) => {
    setEditingLocation(logoType);
  };

  const confirmDeleteLocation = (logoType) => {
    setShowDeleteConfirm(logoType);
  };

  const deleteLogoFromLocation = (logoType) => {
    if (logoType === 'main') {
      if (window.confirm('Are you sure you want to delete the main logo?')) {
        deleteUploadedLogo();
      }
    } else if (logoType === 'favicon') {
      if (window.confirm('Are you sure you want to remove the favicon?')) {
        removeLogoFromType(logoType);
      }
    }
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

  const handleGlobalClick = (e) => {
    // Only handle clicks on the background itself, not its children
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      if (showDeleteConfirm) {
        setShowDeleteConfirm(null);
      }
      if (editingLocation) {
        setEditingLocation(null);
      }
    }
  };

  return (
    <div className="h-full w-full bg-white" onClick={handleGlobalClick}>
      <div className="w-full px-4 sm:px-6 lg:container lg:mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="py-4 sm:py-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Logo</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-8 mb-8">
          {/* Main Logo Upload Section */}
          <div className="md:col-span-3 border border-gray-200 rounded-lg">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 pb-2">Upload Logo</h2>
          
              <input
                ref={mainLogoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
                onChange={handleMainLogoInput}
                className="hidden"
              />
              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ${
                  dragActive 
                    ? 'border-gray-500 bg-white' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  mainLogoInputRef.current?.click();
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="main-logo-upload-area">
                  
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Only trigger if clicking the button
                            if (e.currentTarget === e.target) {
                              mainLogoInputRef.current?.click();
                            }
                          }}
                          className="bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-200 border border-gray-300"
                        >
                          Replace Logo
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteLogoFromLocation('main');
                          }}
                          className="bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          mainLogoInputRef.current?.click();
                        }}
                        className="bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200"
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
            </div>
          </div>
          
          {/* Favicon Upload Section */}
          <div className="md:col-span-1 border border-gray-400">
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Bookmark className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-700">Favicon</h2>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>Website browser icon</p>
                <p className="mt-1">Recommended: 32x32px</p>
                <p className="mt-1 font-medium">Supports: SVG, PNG only</p>
              </div>

              <input
                ref={faviconInputRef}
                type="file"
                accept="image/svg+xml,image/png"
                className="hidden"
                onChange={handleFaviconInput}
              />
              {logoAssignments.favicon ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border border-gray-200 flex flex-col items-center">
                    <img 
                      src={logoAssignments.favicon.url} 
                      alt="Current favicon"
                      className="w-8 h-8 mb-2"
                    />
                    <p className="text-sm text-gray-600">Current Favicon</p>
                    {logoAssignments.favicon.name && (
                      <p className="text-xs text-gray-500 mt-1">{logoAssignments.favicon.name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        faviconInputRef.current?.click();
                      }}
                      className="flex-1 bg-white text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition duration-200 border border-gray-300"
                    >
                      Change
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteLogoFromLocation('favicon');
                      }}
                      className="flex-1 bg-white text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition duration-300 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    faviconInputRef.current?.click();
                  }}
                >
                  <div className="favicon-upload-area">
                    <Bookmark className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload favicon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logo Assignments Section */}
        <div className="mt-12 px-4 border border-gray-400 bg-transparent">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Logo Assignments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {logoTypes.map((type) => {
              const IconComponent = type.icon;
              const hasLogo = logoAssignments[type.key] !== null;
              
              return (
                <div key={type.key} className="bg-white rounded-lg border border-gray-200 p-6 min-h-[280px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                    <h3 className="font-semibold text-gray-700 text-lg">{type.label}</h3>
                  </div>
                  
                  {hasLogo ? (
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="flex-1 flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200">
                        <img 
                          src={logoAssignments[type.key].url}
                          alt={`${type.label} logo`}
                          className="max-h-32 max-w-[200px] object-contain"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => removeLogoFromType(type.key)}
                          className="flex-1 py-2.5 px-4 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          Remove
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`replace-${type.key}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleMainLogoUpload(file, type.key);
                            }
                            e.target.value = '';
                          }}
                        />
                        <button
                          onClick={() => document.getElementById(`replace-${type.key}`).click()}
                          className="flex-1 py-2.5 px-4 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <p className="text-sm text-gray-600 mb-4 flex-1 flex items-center justify-center">{type.description}</p>
                      <button
                        onClick={() => {
                          if (uploadedLogo) {
                            setLogoAssignments(prev => ({
                              ...prev,
                              [type.key]: uploadedLogo
                            }));
                          }
                        }}
                        disabled={!uploadedLogo}
                        className={`text-sm px-4 py-2.5 rounded-lg font-medium ${
                          uploadedLogo
                            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            : 'bg-white text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        Assign Logo
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 