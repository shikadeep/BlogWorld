// EditBlog.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    date: '',
    tags: '',
    content: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/blogs/${id}`);
        const data = res.data;
        setBlog({
          ...data,
          tags: data.tags?.join(', ') || '',
          date: new Date(data.date).toISOString().split('T')[0], // format yyyy-MM-dd
        });
      } catch (err) {
        console.error('Failed to fetch blog', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND}/api/blogs/${id}`, {
        ...blog,
        tags: blog.tags.split(',').map((tag) => tag.trim()),
      });
      navigate(`/dashboard/${localStorage.getItem('userId')}`);
    } catch (err) {
      console.error('Failed to update blog', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow mt-10 rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={blog.author}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={blog.date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={blog.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            rows="5"
            value={blog.content}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
