import React, { useState } from "react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [editIdx, setEditIdx] = useState(null);

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
    <div className="w-full h-full p-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-left font-bold">Blogs</h1>
        <button
          className="bg-transparent border border-gray-400 text-black px-4 py-2 rounded"
          onClick={() => setShowForm((v) => !v)}
        >
          Add Blog
        </button>
      </div>

      {showForm && (
        <form className="mb-6 flex gap-4 items-end flex-wrap bg-white-100 p-4 rounded" onSubmit={handleAddBlog}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-48"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-64"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
              required={editIdx === null}
            />
          </div>
          <button
            type="submit"
            className="bg-transparent border border-gray-400 text-black px-4 py-2 rounded"
          >
            {editIdx !== null ? 'Update' : 'Save'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Title</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-left">Image</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">No blogs yet.</td>
              </tr>
            ) : (
              blogs.map((blog, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border-b align-top">{blog.title}</td>
                  <td className="px-4 py-2 border-b align-top">{blog.description}</td>
                  <td className="px-4 py-2 border-b align-top">
                    <img src={blog.image} alt={blog.title} className="w-24 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 border-b align-top">
                    <button
                      className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      onClick={() => handleEdit(idx)}
                    >Edit</button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDelete(idx)}
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

