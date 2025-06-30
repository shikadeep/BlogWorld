import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    author: '',
    tags: '',
    content: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('user', userId); // send user ID

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/api/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Blog created successfully!');
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Blog creation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Create New Blog</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />

        <textarea
          name="content"
          placeholder="Write your blog content here..."
          value={form.content}
          onChange={handleChange}
          rows="6"
          className="w-full border rounded px-4 py-2"
        ></textarea>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
        >
          Publish Blog
        </button>

        {message && <p className="text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default CreateBlog;
