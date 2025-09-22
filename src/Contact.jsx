import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    useSameNumber: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // If checkbox is checked, copy mobile number to WhatsApp
        whatsappNumber: checked ? prev.mobileNumber : prev.whatsappNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // If mobile number changes and checkbox is checked, update WhatsApp too
        whatsappNumber: name === "mobileNumber" && prev.useSameNumber ? value : prev.whatsappNumber
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Here you can add form submission logic
    alert("Contact information submitted!");
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-left">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-left">Contact</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Mobile Number Field */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (234) 567-8900"
              />
            </div>

            {/* Checkbox for same number */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useSameNumber"
                name="useSameNumber"
                checked={formData.useSameNumber}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useSameNumber" className="ml-2 block text-sm text-gray-700">
                Use same number for WhatsApp
              </label>
            </div>

            {/* WhatsApp Number Field */}
            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number {formData.useSameNumber ? "(Auto-filled)" : "*"}
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                required={!formData.useSameNumber}
                disabled={formData.useSameNumber}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.useSameNumber ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="+1 (234) 567-8900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-transparent border border-gray-400 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Submit Contact Information
            </button>
          </form>

          {/* Display submitted data */}
          {formData.email && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Contact Details:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
                <p><strong>WhatsApp:</strong> {formData.whatsappNumber}</p>
                {formData.useSameNumber && (
                  <p className="text-blue-600 text-xs">✓ Using same number for mobile and WhatsApp</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
