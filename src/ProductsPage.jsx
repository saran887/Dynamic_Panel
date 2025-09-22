import React, { useState, useEffect } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [productInput, setProductInput] = useState({ name: "", category: "", description: "", price: "", quantity: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", category: "", description: "", price: "", quantity: "" });
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Add custom CSS to completely remove blue highlighting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-select option:checked,
      .custom-select option:hover,
      .custom-select option:focus,
      .custom-select option:active {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
      }
      .custom-select option {
        background-color: white !important;
        color: #374151 !important;
      }
      .custom-select::-ms-expand {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput("");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (productInput.name && productInput.category) {
      const newProduct = {
        id: Date.now(), // Simple ID generation
        ...productInput,
        dateAdded: new Date().toLocaleDateString()
      };
      setProducts([...products, newProduct]);
      setProductInput({ name: "", category: "", description: "", price: "", quantity: "" });
      setShowAddProductModal(false); // Close modal after adding product
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    // Also remove products in this category
    setProducts(products.filter(product => product.category !== categoryToDelete));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || ""
    });
  };

  const handleUpdateProduct = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, ...editFormData }
        : product
    ));
    setEditingProduct(null);
    setEditFormData({ name: "", category: "", description: "", price: "" });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({ name: "", category: "", description: "", price: "", quantity: "" });
  };

  return (
    <div className="w-full h-full p-8 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with Add Product Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Products</h1>
          <button 
            onClick={() => setShowAddProductModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 border-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
        </div>
        
        {/* Category Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Manage Categories</h2>
            <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none"
                placeholder="Enter category name"
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="bg-transparent border border-gray-500 text-black px-6 py-2 rounded-lg transition duration-200"
              >
                Add Category
              </button>
            </form>
            
            {/* Categories List */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-600">Categories ({categories.length})</h3>
              {categories.length === 0 ? (
                <p className="text-gray-400 italic">No categories added yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-gray-700">{cat}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} Products
              </span>
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">No products added yet</p>
              <p className="text-gray-500 mt-1">Add your first product using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Product Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Category</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Price</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Created</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Product Name */}
                      <td className="py-4 px-6">
                        {editingProduct === product.id ? (
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                          />
                        ) : (
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.description || 'No description'}
                            </div>
                          </div>
                        )}
                      </td>
                      
                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      
                      {/* Category */}
                      <td className="py-4 px-6">
                        {editingProduct === product.id ? (
                          <select
                            value={editFormData.category}
                            onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                            className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-800"
                          >
                            {categories.map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-600">{product.category}</span>
                        )}
                      </td>
                      
                      {/* Price */}
                      <td className="py-4 px-6">
                        {editingProduct === product.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-sm text-gray-900 font-medium">
                            {product.price ? `$${parseFloat(product.price).toFixed(2)}` : '-'}
                          </span>
                        )}
                      </td>
                    
                      
                      {/* Created Date */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">{product.dateAdded}</span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6">
                        {editingProduct === product.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateProduct(product.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded text-gray-400 hover:text-gray-600"
                              title="Edit product"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded text-gray-400 hover:text-red-600"
                              title="Delete product"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Add New Product</h2>
                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setProductInput({ name: "", category: "", description: "", price: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                    value={productInput.name}
                    onChange={e => setProductInput({ ...productInput, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Product description (optional)"
                    rows="3"
                    value={productInput.description}
                    onChange={e => setProductInput({ ...productInput, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    value={productInput.price}
                    onChange={e => setProductInput({ ...productInput, price: e.target.value })}
                    required
                  />
                </div>

                
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    className="custom-select w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                    value={productInput.category}
                    onChange={e => setProductInput({ ...productInput, category: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {categories.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-700 text-sm">Please add at least one category first before adding products.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProductModal(false);
                      setProductInput({ name: "", category: "", description: "", price: "" });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                    disabled={categories.length === 0}
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
