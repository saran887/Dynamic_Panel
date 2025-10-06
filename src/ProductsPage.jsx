import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Search,
  Eye,
  Plus,
  X,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";

// Sample data
const initialCategories = [];

const initialProducts = [];

const columns = [
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "description", label: "Description" },
  { key: "createdDate", label: "Created Date" },
];

export default function ProductsPage() {
  // State management
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    category: true,
    price: true,
    description: true,
    createdDate: true,
  });
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [newCategory, setNewCategory] = useState({
    name: "",
  });
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Uncategorized",
    originalPrice: 0,
    discountPrice: 0,
    description: "",
  });

  // Helper functions
  const getProductKey = (product) => `product_${product.id}`;

  // Filtered products based on search
  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.price.toString().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Pagination handlers
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(filteredProducts.map(getProductKey));
    } else {
      setSelected([]);
    }
  };

  // Add Product form handler
  const handleAddProduct = (e) => {
    if (e) e.preventDefault();
    if (!newProduct.name.trim()) return;
    if (editMode && editingProduct) {
      // Update existing product
      setProducts(products.map((p) =>
        getProductKey(p) === getProductKey(editingProduct)
          ? { ...editingProduct, ...newProduct }
          : p
      ));
      setEditMode(false);
      setEditingProduct(null);
    } else {
      // Add new product
      const product = {
        ...newProduct,
        id: Date.now(),
        price: newProduct.discountPrice || newProduct.originalPrice,
        createdDate: new Date().toLocaleDateString(),
      };
      setProducts([...products, product]);
    }
    setNewProduct({
      name: "",
      category: "Uncategorized",
      originalPrice: 0,
      discountPrice: 0,
      description: "",
    });
    setShowProductModal(false);
  };

  const handleSelect = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Category form handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        name: newCategory.name.trim(),
        description: "", // Default empty description since we removed the input
      };
      setCategories([...categories, category]);
      setNewCategory({ name: "" });
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (window.confirm(`Are you sure you want to delete "${categoryToDelete.name}" category?`)) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      // Update products that have this category to "Uncategorized"
      setProducts(products.map(product => 
        product.category === categoryToDelete.name 
          ? { ...product, category: "Uncategorized" }
          : product
      ));
    }
  };

  const calculateDiscount = (originalPrice, discountPrice) => {
    if (originalPrice <= discountPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Action handlers
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      originalPrice: product.originalPrice || 0,
      discountPrice: product.discountPrice || 0,
      description: product.description || "",
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(products.filter(p => p.id !== product.id));
      setSelected(selected.filter(id => id !== getProductKey(product)));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selected.length} product(s)?`)) {
      setProducts(products.filter(product => !selected.includes(getProductKey(product))));
      setSelected([]);
    }
  };

  const allChecked = filteredProducts.length > 0 && filteredProducts.every((p) => selected.includes(getProductKey(p)));
  const someChecked = selected.length > 0 && !allChecked;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col w-full bg-white p-6 items-start">
        <h1 className="text-4xl font-bold mb-8 text-left text-gray-800">
          
          Products
        </h1>
        
        {/* Header Controls */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-80 rounded-lg bg-white border-gray-200 text-base"
              />
            </div>
            <div className="flex gap-2">
              {/* Select All and Delete button section */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="font-medium flex items-center gap-2"
                  onClick={(e) => handleSelectAll(!allChecked)}
                >
                  {allChecked ? 'Deselect All' : 'Select All'}
                </Button>

                {selected.length > 0 && (
                  <Button
                    variant="destructive"
                    size="default"
                    className="font-medium"
                    onClick={handleBulkDelete}
                  >
                    Delete ({selected.length})
                  </Button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4" /> View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500">
                    Toggle columns
                  </div>
                  {columns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key]}
                      onCheckedChange={() =>
                        setVisibleColumns((v) => ({
                          ...v,
                          [col.key]: !v[col.key],
                        }))
                      }
                      className="capitalize"
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                className="font-medium flex items-center gap-2"
                onClick={() => setShowCategoryModal(true)}
              >
                <Tag className="w-4 h-4" />
                Add Category
              </Button>
              <Button
                className="bg-black border border-gray-300 text-white font-medium flex items-center gap-2"
                onClick={() => {
                  setEditMode(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    category: "Uncategorized",
                    originalPrice: 0,
                    discountPrice: 0,
                    description: "",
                  });
                  setShowProductModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-gray-700 bg-white border-b">
                  <th className="px-4 py-3 w-10 rounded-tl-lg">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = someChecked;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  {visibleColumns.name && (
                    <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                  )}
                  {visibleColumns.category && (
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                  )}
                  {visibleColumns.price && (
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                  )}
                  {visibleColumns.description && (
                    <th className="px-4 py-3 text-left font-semibold">Description</th>
                  )}
                  {visibleColumns.createdDate && (
                    <th className="px-4 py-3 text-left font-semibold">Created Date</th>
                  )}
                  <th className="px-4 py-3 text-center font-semibold rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-900 divide-y divide-gray-200">
                {paginatedProducts.map((product) => {
                  const key = getProductKey(product);
                  return (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 align-middle">
                        <input
                          type="checkbox"
                          checked={selected.includes(key)}
                          onChange={() => handleSelect(key)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      {visibleColumns.name && (
                        <td className="px-4 py-3 align-middle font-medium text-gray-900">
                          {product.name}
                        </td>
                      )}
                      {visibleColumns.category && (
                        <td className="px-4 py-3 align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-blue-800">
                            {product.category}
                          </span>
                        </td>
                      )}
                      {visibleColumns.price && (
                        <td className="px-4 py-3 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                ₹{product.discountPrice?.toFixed(2) || '0.00'}
                              </span>
                              {product.originalPrice > product.discountPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.originalPrice?.toFixed(2) || '0.00'}
                                </span>
                              )}
                            </div>
                            {product.originalPrice > product.discountPrice && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {calculateDiscount(product.originalPrice, product.discountPrice)}% OFF
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      {visibleColumns.description && (
                        <td className="px-4 py-3 align-middle text-gray-600 max-w-xs truncate">
                          {product.description}
                        </td>
                      )}
                      {visibleColumns.createdDate && (
                        <td className="px-4 py-3 align-middle text-gray-500">
                          {product.createdDate}
                        </td>
                      )}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                            title="View Product Details"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100  transition-colors"
                            title="Edit Product"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            className="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors"
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center mt-4 text-gray-500 text-sm w-full">
            <span className="flex-1">
              {selected.length} of {filteredProducts.length} row(s) selected.
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <span>Rows per page</span>
              <select
                className="border rounded-lg px-2 py-1 text-sm bg-white"
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>Page {currentPage} of {totalPages || 1}</span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
            
            {/* Existing Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title={`Delete ${category.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Category Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add New Category
                </label>
                <Input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(false)}
              >
                Close
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <Input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="Uncategorized">Uncategorized</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₹)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.discountPrice}
                  onChange={(e) => setNewProduct({...newProduct, discountPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              {newProduct.originalPrice > 0 && newProduct.discountPrice > 0 && newProduct.originalPrice > newProduct.discountPrice && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">
                    Discount: {calculateDiscount(newProduct.originalPrice, newProduct.discountPrice)}% OFF
                  </span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowProductModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                {editMode ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <p className="text-gray-900 font-medium">{selectedProduct.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedProduct.category}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Details
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{selectedProduct.discountPrice?.toFixed(2) || '0.00'}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.discountPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{selectedProduct.originalPrice?.toFixed(2) || '0.00'}
                      </span>
                    )}
                  </div>
                  {selectedProduct.originalPrice > selectedProduct.discountPrice && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountPrice)}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="text-gray-900">{selectedProduct.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <p className="text-gray-500">{selectedProduct.createdDate}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setViewProductModal(false);
                  setSelectedProduct(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
