import React, { useState } from "react";
import {
   Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Eye,
  FileText,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [editIdx, setEditIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    title: true,
    description: true,
    image: true,
    createdDate: true,
  });

  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedBlogs.map((_, idx) => idx + startIndex));
    } else {
      setSelected([]);
    }
  };

  const allChecked = paginatedBlogs.length > 0 && 
    paginatedBlogs.every((_, idx) => selected.includes(idx + startIndex));
  const someChecked = selected.length > 0 && !allChecked;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || (!form.image && editIdx === null)) return;
    if (editIdx !== null) {
      // Edit mode
      setBlogs((prev) => prev.map((b, i) =>
        i === editIdx
          ? {
              title: form.title,
              description: form.description,
              image: form.image ? URL.createObjectURL(form.image) : b.image,
            }
          : b
      ));
      setEditIdx(null);
    } else {
      // Add mode
      const newBlog = {
        title: form.title,
        description: form.description,
        image: URL.createObjectURL(form.image),
      };
      setBlogs([newBlog, ...blogs]);
    }
    setForm({ title: '', description: '', image: null });
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setForm({
      title: blogs[idx].title,
      description: blogs[idx].description,
      image: null, // Don't prefill file input
    });
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    setBlogs((prev) => prev.filter((_, i) => i !== idx));
    // If deleting the one being edited, reset form
    if (editIdx === idx) {
      setEditIdx(null);
      setForm({ title: '', description: '', image: null });
      setShowForm(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Blogs</h1>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4 sm:mb-6 w-full">
        <div className="relative flex-grow sm:flex-grow-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-80 rounded-lg bg-white border-gray-200 text-base"
          />
        </div>
        <div className="flex gap-2">
          {/* Select All and Delete button section */}
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
                  if (window.confirm("Are you sure you want to delete the selected blogs?")) {
                    setBlogs(blogs.filter((_, idx) => !selected.includes(idx)));
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
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="w-4 h-4" />
            Add Blog
          </Button>
        </div>
      </div>

      {/* Blog Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editIdx !== null ? 'Edit Blog' : 'Add New Blog'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full h-24 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  required
                  placeholder="Enter blog description"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image{editIdx === null && <span className="text-red-500">*</span>}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    required={editIdx === null}
                    className="hidden"
                    id="blog-image-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('blog-image-input').click()}
                  >
                    Choose Image File
                  </Button>
                  {form.image && (
                    <p className="text-sm text-gray-600">
                      Selected: {form.image instanceof File ? form.image.name : 'Current image'}
                    </p>
                  )}
                </div>
                {form.image && (
                  <div className="mt-2">
                    <img
                      src={form.image instanceof File ? URL.createObjectURL(form.image) : form.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBlog}>
                {editIdx !== null ? 'Update Blog' : 'Add Blog'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Table Actions */}
        <div className="flex gap-2">
          {/* Select All and Delete button section */}
          <div className="flex items-center gap-2">
            

            {selected.length > 0 && (
              <button
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete the selected blogs?')) {
                    setBlogs(blogs.filter((_, idx) => !selected.includes(idx)));
                    setSelected([]);
                  }
                }}
              >
                Delete ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg border w-full">
          <div className="flex flex-col">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-gray-700 bg-white border-b">
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
                    {columnVisibility.title && (
                      <th className="px-4 py-3">Title</th>
                    )}
                    {columnVisibility.image && (
                      <th className="px-4 py-3">Image</th>
                    )}
                    {columnVisibility.description && (
                      <th className="px-4 py-3">Description</th>
                    )}
                    {columnVisibility.createdDate && (
                      <th className="px-4 py-3">Created Date</th>
                    )}
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200">
                  {paginatedBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">No blogs yet.</td>
                    </tr>
                  ) : (
                    paginatedBlogs.map((blog, idx) => {
                      const actualIdx = startIndex + idx;
                      return (
                        <tr key={actualIdx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selected.includes(actualIdx)}
                              onChange={() => {
                                setSelected(
                                  selected.includes(actualIdx)
                                    ? selected.filter(i => i !== actualIdx)
                                    : [...selected, actualIdx]
                                );
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          {columnVisibility.title && (
                            <td className="px-4 py-3">{blog.title}</td>
                          )}
                          {columnVisibility.image && (
                            <td className="px-4 py-3">
                              <img src={blog.image} alt={blog.title} className="w-24 h-16 object-cover rounded" />
                            </td>
                          )}
                          {columnVisibility.description && (
                            <td className="px-4 py-3">{blog.description}</td>
                          )}
                          {columnVisibility.createdDate && (
                            <td className="px-4 py-3">
                              {new Date().toLocaleDateString()}
                            </td>
                          )}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                onClick={() => handleEdit(actualIdx)}
                                title="View Blog"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => handleEdit(actualIdx)}
                                title="Edit Blog"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors"
                                onClick={() => handleDelete(actualIdx)}
                                title="Delete Blog"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, blogs.length)} of {blogs.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

