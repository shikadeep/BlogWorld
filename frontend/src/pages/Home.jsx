// Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [activeTag, setActiveTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  const handleLike = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND}/api/blogs/like/${id}`, {
        userId
      });

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id
            ? {
              ...b,
              likes: res.data.likes,
              likedBy: b.likedBy.some(u => (u._id || u) === userId)
                ? b.likedBy.filter(u => (u._id || u) !== userId)
                : [...(b.likedBy || []), { _id: userId, email: userEmail }]
            }
            : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error liking/disliking blog");
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/blogs`);
        setBlogs(res.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog.author?.toLowerCase().includes(search.toLowerCase()) ||
    blog.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortOption === 'latest') return new Date(b.date) - new Date(a.date); // Most recent first
    if (sortOption === 'oldest') return new Date(a.date) - new Date(b.date); // Oldest first
    if (sortOption === 'likes') return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  const tagFilteredBlogs = activeTag
    ? sortedBlogs.filter((blog) => blog.tags?.includes(activeTag))
    : sortedBlogs;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = tagFilteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(tagFilteredBlogs.length / blogsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold text-blue-700">Latest Blogs</h1>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/2"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/4"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="likes">Sort by Most Liked</option>
          </select>
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="text-sm text-red-500 underline"
            >
              Clear Tag Filter: #{activeTag}
            </button>
          )}
        </div>

        {/* Blog List */}
        {currentBlogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {currentBlogs.map((blog) => (

              <div
                key={blog._id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300"
              >
                <img
                  src={
                    blog.image
                      ? `${import.meta.env.VITE_BACKEND}/${blog.image.replace(/\\/g, '/')}`
                      : 'https://via.placeholder.com/400x200?text=No+Image'
                  }
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">{blog.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.content?.replace(/<[^>]+>/g, '') || 'No content available'}
                  </p>

                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => setActiveTag(tag)}
                          className={`cursor-pointer bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-200 ${activeTag === tag ? 'bg-blue-300' : ''
                            }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    By {blog.author} · {new Date(blog.date).toLocaleDateString()}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(blog._id)}
                    className="mt-3 flex items-center gap-1 text-pink-600"
                  >
                    {blog.likedBy?.some(u => (u._id || u) === userId) ? (
                      <SolidHeartIcon className="w-5 h-5" />
                    ) : (
                      <OutlineHeartIcon className="w-5 h-5 hover:fill-pink-600 transition" />
                    )}
                    <span className="text-sm">
                      {blog.likes || 0} Like{blog.likes === 1 ? '' : 's'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
