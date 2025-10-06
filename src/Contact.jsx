import React, { useState } from "react";
import { MapPin, ExternalLink, Check, X, Phone, Mail, MessageCircle, Send, User, Building } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    whatsappNumber: "",
    useSameNumber: false,
    mapUrl: "",
    mapIframe: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [mobileValidation, setMobileValidation] = useState({
    isValid: true,
    message: ""
  });

  const [alternateMobileValidation, setAlternateMobileValidation] = useState({
    isValid: true,
    message: ""
  });

  const [whatsappValidation, setWhatsappValidation] = useState({
    isValid: true,
    message: ""
  });

  const [mapValidation, setMapValidation] = useState({
    isValid: false,
    isEmbedUrl: false,
    extractedUrl: "",
    message: ""
  });

  const [showMapPreview, setShowMapPreview] = useState(false);

  // Indian mobile number validation function
  const validateIndianMobileNumber = (phoneNumber) => {
    if (!phoneNumber.trim()) {
      return { isValid: true, message: "" }; // Empty is valid (required validation handles this)
    }

    // Remove all non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Indian mobile number patterns
    // Should be 10 digits starting with 6, 7, 8, or 9
    // Or 11 digits starting with 0 followed by 6, 7, 8, or 9
    // Or 12 digits starting with 91 followed by 6, 7, 8, or 9
    const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    
    if (!indianMobileRegex.test(cleanNumber)) {
      return {
        isValid: false,
        message: "Please enter a valid Indian mobile number (should start with 6, 7, 8, or 9 and be 10 digits)"
      };
    }

    // Additional length checks
    if (cleanNumber.length === 10) {
      // Direct 10-digit number should start with 6-9
      if (!/^[6-9]/.test(cleanNumber)) {
        return {
          isValid: false,
          message: "Indian mobile numbers should start with 6, 7, 8, or 9"
        };
      }
    } else if (cleanNumber.length === 11) {
      // 11-digit number should start with 0 then 6-9
      if (!/^0[6-9]/.test(cleanNumber)) {
        return {
          isValid: false,
          message: "Invalid format. Use format like 06XXXXXXXX or +91 6XXXXXXXX"
        };
      }
    } else if (cleanNumber.length === 12) {
      // 12-digit number should start with 91 then 6-9
      if (!/^91[6-9]/.test(cleanNumber)) {
        return {
          isValid: false,
          message: "Invalid format. Country code should be +91 followed by valid mobile number"
        };
      }
    } else {
      return {
        isValid: false,
        message: "Invalid mobile number length. Please enter a valid Indian mobile number"
      };
    }

    return { isValid: true, message: "" };
  };

  const extractUrlFromIframe = (iframeHtml) => {
    try {
      // Extract src attribute from iframe HTML
      const srcMatch = iframeHtml.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        return srcMatch[1];
      }
    } catch (error) {
      console.error('Error extracting URL from iframe:', error);
    }
    return null;
  };

  const validateMapInput = (input) => {
    if (!input.trim()) {
      setMapValidation({
        isValid: false,
        isEmbedUrl: false,
        extractedUrl: "",
        message: ""
      });
      return;
    }

    let urlToValidate = input.trim();

    // Check if input is iframe HTML
    if (input.includes('<iframe') && input.includes('</iframe>')) {
      const extractedUrl = extractUrlFromIframe(input);
      if (extractedUrl) {
        urlToValidate = extractedUrl;
        setFormData(prev => ({ ...prev, mapUrl: extractedUrl }));
      } else {
        setMapValidation({
          isValid: false,
          isEmbedUrl: false,
          extractedUrl: "",
          message: "❌ Could not extract URL from iframe HTML"
        });
        return;
      }
    }

    // Validate the extracted or direct URL
    validateMapUrl(urlToValidate);
  };

  const validateMapUrl = (url) => {
    if (!url) {
      setMapValidation({
        isValid: false,
        isEmbedUrl: false,
        extractedUrl: "",
        message: ""
      });
      return;
    }

    // Check for Google Maps embed URL
    const googleEmbedRegex = /^https:\/\/www\.google\.com\/maps\/embed\?.+/;
    const googleMapsRegex = /^https:\/\/(www\.)?google\.com\/maps/;
    
    // Check for other map services
    const mapboxRegex = /^https:\/\/api\.mapbox\.com\/styles\/.+/;
    const osmRegex = /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html/;

    if (googleEmbedRegex.test(url)) {
      setMapValidation({
        isValid: true,
        isEmbedUrl: true,
        extractedUrl: url,
        message: "✅ Valid Google Maps embed URL detected"
      });
    } else if (googleMapsRegex.test(url)) {
      // Convert regular Google Maps URL to embed URL
      const convertedUrl = convertToEmbedUrl(url);
      if (convertedUrl) {
        setFormData(prev => ({ ...prev, mapUrl: convertedUrl }));
        setMapValidation({
          isValid: true,
          isEmbedUrl: true,
          extractedUrl: convertedUrl,
          message: "✅ Converted regular Google Maps URL to embed URL"
        });
      } else {
        setMapValidation({
          isValid: false,
          isEmbedUrl: false,
          extractedUrl: "",
          message: "❌ Could not convert to embed URL"
        });
      }
    } else if (mapboxRegex.test(url) || osmRegex.test(url)) {
      setMapValidation({
        isValid: true,
        isEmbedUrl: true,
        extractedUrl: url,
        message: "✅ Valid map embed URL detected"
      });
    } else {
      setMapValidation({
        isValid: false,
        isEmbedUrl: false,
        extractedUrl: "",
        message: "❌ Invalid embedded map URL. Please provide a valid Google Maps embed URL (should start with https://www.google.com/maps/embed) or iframe HTML"
      });
    }
  };

  const convertToEmbedUrl = (url) => {
    try {
      // Extract place/location info from Google Maps URL
      const placeMatch = url.match(/place\/([^\/]+)/);
      const coordsMatch = url.match(/@([-\d.]+),([-\d.]+)/);
      
      if (placeMatch) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(placeMatch[1])}!5e0!3m2!1sen!2sin!4v1000000000000!5m2!1sen!2sin`;
      } else if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v1000000000000!5m2!1sen!2sin`;
      }
    } catch (error) {
      console.error('Error converting URL:', error);
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // If checkbox is checked, copy mobile number to WhatsApp
        whatsappNumber: checked ? prev.mobileNumber : prev.whatsappNumber
      }));
      
      // If checkbox state changes and mobile number exists, validate WhatsApp number
      if (name === "useSameNumber" && checked) {
        const validation = validateIndianMobileNumber(formData.mobileNumber);
        setWhatsappValidation(validation);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // If mobile number changes and checkbox is checked, update WhatsApp too
        whatsappNumber: name === "mobileNumber" && prev.useSameNumber ? value : prev.whatsappNumber
      }));

      // Validate mobile numbers
      if (name === "mobileNumber") {
        const validation = validateIndianMobileNumber(value);
        setMobileValidation(validation);
        
        // If using same number for WhatsApp, validate WhatsApp too
        if (formData.useSameNumber) {
          setWhatsappValidation(validation);
        }
      } else if (name === "alternateMobileNumber") {
        const validation = validateIndianMobileNumber(value);
        setAlternateMobileValidation(validation);
      } else if (name === "whatsappNumber") {
        const validation = validateIndianMobileNumber(value);
        setWhatsappValidation(validation);
      }

      // Validate map URL if it's the map field
      if (name === "mapIframe") {
        validateMapInput(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate mobile numbers before submission
    const mobileValidationResult = validateIndianMobileNumber(formData.mobileNumber);
    const alternateMobileValidationResult = formData.alternateMobileNumber 
      ? validateIndianMobileNumber(formData.alternateMobileNumber)
      : { isValid: true, message: "" };
    const whatsappValidationResult = formData.useSameNumber 
      ? mobileValidationResult 
      : validateIndianMobileNumber(formData.whatsappNumber);
    
    setMobileValidation(mobileValidationResult);
    setAlternateMobileValidation(alternateMobileValidationResult);
    setWhatsappValidation(whatsappValidationResult);
    
    // Check if location is provided and valid
    if (!formData.mapIframe.trim()) {
      alert("Please provide an embedded map URL (Google Maps embed URL or iframe HTML).");
      return;
    }
    
    // Prevent submission if validation fails
    if (!mobileValidationResult.isValid || !whatsappValidationResult.isValid) {
      alert("Please fix the mobile number validation errors before submitting.");
      return;
    }
    
    // Prevent submission if map URL is invalid
    if (formData.mapIframe.trim() && !mapValidation.isValid) {
      alert("Please provide a valid embedded map URL or iframe HTML.");
      return;
    }
    
    console.log("Form Data:", formData);
    setIsSubmitted(true);
    // Here you can add form submission logic
    alert("Contact information submitted!");
  };

  return (
    <div className="min-h-screen bg-white -mt-4">
      <div className="w-full h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact</h1>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!isSubmitted ? (
          /* Contact Form */
          <div className="bg-white rounded-xl  p-8 border border-gray-100">
            <div className="mb-8">
              <p className="text-gray-600">Fill out the form below with your contact details and location.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      Email Address *
                    </div>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Numbers Section */}
                <div className="space-y-6">
                  {/* Mobile Numbers Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Primary Mobile Number */}
                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          Mobile Number *
                        </div>
                      </label>
                      <Input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        required
                        className={!mobileValidation.isValid ? 'border-red-300 focus:ring-red-500' : ''}
                        placeholder="+91 98765 43210"
                      />
                      {!mobileValidation.isValid && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <X size={14} />
                          {mobileValidation.message}
                        </p>
                      )}
                      {mobileValidation.isValid && formData.mobileNumber && (
                        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                          <Check size={14} />
                          Valid Indian mobile number
                        </p>
                      )}
                      {/* Checkbox for using same number for WhatsApp */}
                      <div className="mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.useSameNumber}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                useSameNumber: checked,
                                whatsappNumber: checked ? prev.mobileNumber : ""
                              }));
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                          />
                          <span className="text-sm text-gray-600">Use same number for WhatsApp</span>
                        </label>
                      </div>
                    </div>

                    {/* Alternate Mobile Number */}
                    <div>
                      <label htmlFor="alternateMobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          Alternate Mobile Number
                        </div>
                      </label>
                      <Input
                        type="tel"
                        id="alternateMobileNumber"
                        name="alternateMobileNumber"
                        value={formData.alternateMobileNumber}
                        onChange={handleInputChange}
                        className={!alternateMobileValidation.isValid ? 'border-red-300 focus:ring-red-500' : ''}
                        placeholder="+91 98765 43210"
                      />
                      {!alternateMobileValidation.isValid && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <X size={14} />
                          {alternateMobileValidation.message}
                        </p>
                      )}
                      {alternateMobileValidation.isValid && formData.alternateMobileNumber && (
                        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                          <Check size={14} />
                          Valid Indian mobile number
                        </p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Section */}                {/* WhatsApp Number */}
                  <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-gray-500" />
                        WhatsApp Number {formData.useSameNumber ? "(Auto-filled)" : "*"}
                      </div>
                    </label>
                    <Input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      disabled={formData.useSameNumber}
                      onChange={handleInputChange}
                      required={!formData.useSameNumber}
                      className={`${
                        formData.useSameNumber 
                          ? 'bg-gray-100 cursor-not-allowed' 
                          : !whatsappValidation.isValid 
                            ? 'border-red-300 focus:ring-red-500' 
                            : ''
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {!formData.useSameNumber && !whatsappValidation.isValid && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <X size={14} />
                        {whatsappValidation.message}
                      </p>
                    )}
                    {!formData.useSameNumber && whatsappValidation.isValid && formData.whatsappNumber && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <Check size={14} />
                        Valid Indian mobile number
                      </p>
                    )}
                    {formData.useSameNumber && (
                      <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                        <Check size={14} />
                        Using same number as mobile
                      </p>
                    )}

                    {/* Same Number Checkbox */}
                    
                  </div>

                </div>

                {/* Map Embed Field */}
                <div>
                  <label htmlFor="mapIframe" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      Embedded Map URL *
                    </div>
                  </label>
                  <textarea
                    id="mapIframe"
                    name="mapIframe"
                    value={formData.mapIframe}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none font-mono text-sm"
                    placeholder="Paste Google Maps embed URL or iframe HTML here (e.g., https://www.google.com/maps/embed?pb=...)"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    💡 <strong>How to get embed URL:</strong> Go to Google Maps → Search your location → Share → Embed a map → Copy the iframe HTML or just the URL
                  </p>
                  
                  {/* URL Validation Message */}
                  {formData.mapIframe && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <div className="flex items-start gap-2">
                        {mapValidation.isValid ? (
                          <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${mapValidation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                            {mapValidation.message}
                          </span>
                          {mapValidation.extractedUrl && (
                            <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border break-all">
                              <strong>Extracted URL:</strong> {mapValidation.extractedUrl}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Map Preview Toggle */}
                  {mapValidation.isValid && mapValidation.isEmbedUrl && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setShowMapPreview(!showMapPreview)}
                        className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm border border-blue-200 transition-colors duration-200"
                      >
                        <ExternalLink size={14} />
                        {showMapPreview ? 'Hide Map Preview' : 'Show Map Preview'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Map Preview */}
                {showMapPreview && mapValidation.isValid && mapValidation.isEmbedUrl && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin size={16} />
                        Location Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMapPreview(false)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="aspect-video bg-white">
                      <iframe
                        src={mapValidation.extractedUrl || formData.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location Preview"
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-transparent border border-gray-400 text-black  py-4 px-6 rounded-lg"
                >
                  
                  Submit
                </button>
              </form>
          </div>
        ) : (
          /* Map Display After Submission */
          <div className="space-y-6">
            <div className="bg-white border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white p-3 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-green-800">Contact Information Submitted!</h3>
                  <p className="text-green-600">Thank you for providing your details and location.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    email: "",
                    mobileNumber: "",
                    whatsappNumber: "",
                    useSameNumber: false,
                    mapUrl: "",
                    mapIframe: ""
                  });
                  setMapValidation({
                    isValid: false,
                    isEmbedUrl: false,
                    extractedUrl: "",
                    message: ""
                  });
                  setShowMapPreview(false);
                  setMobileValidation({ isValid: true, message: "" });
                  setWhatsappValidation({ isValid: true, message: "" });
                }}
                className="w-full mt-4 bg-white hover:bg-gray-50 text-green-800 font-semibold py-3 px-4 rounded-lg border border-green-300 hover:border-green-400 transition-all duration-200"
              >
                Submit Another Form
              </button>
            </div>
            
            {/* Display the embedded map */}
            {mapValidation.isValid && mapValidation.extractedUrl && (
              <div className="bg-white rounded-xl  overflow-hidden border border-gray-100">
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Your Location
                  </h4>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={mapValidation.extractedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Your Location"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
