import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [showLikers, setShowLikers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);

    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/blogs/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching user blogs:', err);
      }
    };

    fetchUserBlogs();
  }, [userId]);

  const handleCreateBlog = () => navigate('/create-blog');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND}/api/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const toggleLikers = (id) => {
    setShowLikers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const mostLiked = blogs.length > 0 ? Math.max(...blogs.map((b) => b.likes || 0)) : 0;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <UserCircleIcon className="h-12 w-12 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            {userEmail && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span>{userEmail}</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                  Admin
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons on the right */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition text-sm"
          >
            Go to Home
          </Link>
          <button
            onClick={handleCreateBlog}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Create Blog
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Blogs</h3>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>You haven't posted any blogs yet.</p>
          <button
            onClick={handleCreateBlog}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First Blog
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={`relative bg-white p-4 rounded shadow transition border-2 ${blog.likes === mostLiked ? 'border-pink-500' : 'border-transparent'
                }`}
            >
              {blog.image && (
                <img
                  src={`${import.meta.env.VITE_BACKEND}/${blog.image.replace(/\\/g, '/')}`}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded py-2 px-2 mb-4"
                />
              )}

              {/* Edit and Delete */}
              <button
                onClick={() => navigate(`/edit-blog/${blog._id}`)}
                className="absolute top-1 right-10 text-yellow-500 hover:text-yellow-600"
                title="Edit blog"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="absolute top-1 right-2 text-red-500 hover:text-red-600"
                title="Delete blog"
              >
                <TrashIcon className="h-5 w-5" />
              </button>

              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-sm text-gray-600">{new Date(blog.date).toLocaleDateString()}</p>

              <p className="text-sm mt-1">
                <button
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Blog
                </button>
              </p>

              {/* Like Count Button */}
              <button
                onClick={() => toggleLikers(blog._id)}
                className="mt-3 flex items-center gap-1 text-pink-600"
              >
                <SolidHeartIcon className="w-5 h-5" />
                <span className="text-sm">{blog.likes || 0} view likes {blog.likes === 1 ? '' : ''}</span>
              </button>

              {/* Liked By List (Only after click) */}
              {showLikers[blog._id] && blog.likedBy?.length > 0 && (
                <div className="mt-2 text-xs text-blue-700">
                  <strong>Liked by:</strong>{' '}
                  {blog.likedBy.map((user, index) => (
                    <span key={user._id}>
                      {user.email}
                      {index < blog.likedBy.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
