import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  X,
  PenSquare,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Search,
  SlidersHorizontal,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,  
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  
} from "@/components/ui/dropdown-menu";

export default function ServicesPage() {
  // Services state
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    title: true,
    description: true,
    image: true,
    createdDate: true,
  });

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate pagination values
  const totalPages = Math.ceil(services.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedServices = services.slice(startIndex, endIndex);

  // Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedServices.map((_, idx) => idx + startIndex));
    } else {
      setSelected([]);
    }
  };

  const allChecked = paginatedServices.length > 0 && 
    paginatedServices.every((_, idx) => selected.includes(idx + startIndex));
  const someChecked = selected.length > 0 && !allChecked;

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Update existing service
      const updatedServices = [...services];
      updatedServices[editingIndex] = newService;
      setServices(updatedServices);
    } else {
      // Add new service
      setServices((prev) => [...prev, newService]);
    }
    handleCloseModal();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewService(services[index]);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingIndex(null);
    setNewService({
      title: "",
      description: "",
      imageUrl: "",
    });
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <div className="min-h-screen bg-white pt-6 sm:pt-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Services</h1>
        </div>

        {/* Header Controls */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 rounded-lg bg-white border-gray-200 text-base"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="font-medium flex items-center gap-2"
                onClick={() => handleSelectAll(!allChecked)}
              >
                {allChecked ? "Deselect All" : "Select All"}
              </Button>

              {selected.length > 0 && (
                <Button
                  variant="destructive"
                  size="default"
                  className="font-medium"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete the selected services?")) {
                      setServices(services.filter((_, idx) => !selected.includes(idx)));
                      setSelected([]);
                    }
                  }}
                >
                  Delete ({selected.length})
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 font-medium">
                  <SlidersHorizontal className="h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.title}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, title: checked }))
                  }
                >
                  Title
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.description}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, description: checked }))
                  }
                >
                  Description
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.image}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, image: checked }))
                  }
                >
                  Image
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.createdDate}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, createdDate: checked }))
                  }
                >
                  Created Date
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-black border border-gray-300 text-white font-medium flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Table Container */}
          <div className="bg-white rounded-lg border w-full">
            <div className="flex flex-col">
              {/* Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 w-10">
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
                        {columnVisibility.image && (
                          <th className="px-4 py-3 text-left font-semibold">Image</th>
                        )}
                        {columnVisibility.title && (
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => {
                              const sorted = [...services].sort((a, b) => a.title.localeCompare(b.title));
                              setServices(sorted);
                            }}
                          >
                            Title <ArrowUpDown className="inline w-4 h-4 ml-1" />
                          </th>
                        )}
                        {columnVisibility.description && (
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                        )}
                        {columnVisibility.createdDate && (
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Created Date
                          </th>
                        )}
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No services yet.
                          </td>
                        </tr>
                      ) : (
                        paginatedServices.map((service, index) => (
                          <tr key={startIndex + index}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selected.includes(startIndex + index)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelected([...selected, startIndex + index]);
                                  } else {
                                    setSelected(selected.filter(i => i !== startIndex + index));
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                            </td>
                            {columnVisibility.image && (
                              <td className="px-4 py-3">
                                {service.imageUrl && (
                                  <img
                                    src={service.imageUrl}
                                    alt={service.title}
                                    className="h-12 w-12 object-cover rounded-lg"
                                  />
                                )}
                              </td>
                            )}
                            {columnVisibility.title && (
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {service.title}
                                </div>
                              </td>
                            )}
                            {columnVisibility.description && (
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-md truncate">
                                  {service.description}
                                </div>
                              </td>
                            )}
                            {columnVisibility.createdDate && (
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {new Date().toLocaleDateString()}
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(startIndex + index)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <PenSquare className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setViewingService(services[startIndex + index]);
                                    setShowViewModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(startIndex + index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white border-t gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-[120px]">
                        {rowsPerPage} per page
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {[5, 10, 20].map((value) => (
                        <DropdownMenuCheckboxItem
                          key={value}
                          checked={rowsPerPage === value}
                          onCheckedChange={() => {
                            setRowsPerPage(value);
                            setCurrentPage(1);
                          }}
                        >
                          {value} rows
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="text-sm text-gray-700 text-center sm:text-left">
                    Showing {services.length > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(endIndex, services.length)} of {services.length} entries
                  </span>
                </div>
                <div className="flex gap-1 justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Service Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 p-4 sm:p-6 sm:pt-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingIndex !== null ? "Edit Service" : "Add New Service"}
                  </h2>
                  <button onClick={handleCloseModal}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 px-6 pb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={newService.title}
                      onChange={handleInputChange}
                      placeholder="Enter service title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newService.description}
                      onChange={handleInputChange}
                      placeholder="Enter service description"
                      rows="4"
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="service-image-input"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('service-image-input').click()}
                      >
                        Choose Image File
                      </Button>
                      {newService.imageUrl && (
                        <p className="text-sm text-gray-600">
                          Image selected
                        </p>
                      )}
                    </div>
                  </div>
                  {newService.imageUrl && (
                    <div className="relative w-full h-32">
                      <img
                        src={newService.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setNewService((prev) => ({ ...prev, imageUrl: "" }))}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingIndex !== null ? "Update Service" : "Add Service"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Service Modal */}
          {showViewModal && viewingService && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">View Service</h2>
                  <button onClick={() => setShowViewModal(false)}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  {viewingService.imageUrl && (
                    <div className="w-full h-48 relative rounded-md overflow-hidden">
                      <img
                        src={viewingService.imageUrl}
                        alt={viewingService.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {viewingService.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {viewingService.description}
                    </p>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowViewModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
