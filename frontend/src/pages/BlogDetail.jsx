import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to load blog", err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-10 text-gray-500">Loading blog...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-white shadow-lg rounded-xl">
      
      {/* Navigation Links */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="text-blue-600 font-medium hover:underline bg-gray-100 px-3 py-1 rounded-md shadow-sm"
        >
          Home
        </Link>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={`${import.meta.env.VITE_BACKEND}/${blog.image.replace(/\\/g, '/')}`}
          alt={blog.title}
          className="w-2xl h-72 mx-4 object-cover rounded-lg mb-6 shadow"
        />
      )}

      {/* Blog Title & Meta */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By <span className="font-medium">{blog.author}</span> ·{' '}
        {new Date(blog.date).toLocaleDateString()}
      </p>

      {/* Blog Content */}
      <div
        className="prose max-w-none prose-lg text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
