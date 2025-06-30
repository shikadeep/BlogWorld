const Blog = require('../Models/Blog');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, date, author, tags, content, user } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'Missing user ID' });
    }

    const blog = new Blog({
      title,
      date,
      author,
      tags: tags.split(',').map(tag => tag.trim()),
      content,
      image: req.file ? req.file.path : null,
      user,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog saved', blog });
  } catch (err) {
    console.error('Error saving blog:', err.message);
    res.status(500).json({ message: 'Failed to upload blog', error: err.message });
  }
};

// Get all blogs with liked user emails
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('likedBy', 'email'); // only email of liked users

    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err.message);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// Get Blogs by User
exports.getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('likedBy', 'email');

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user blogs', error: err.message });
  }
};

// Like a blog (only once per user)
// Toggle Like/Dislike
// exports.putlikesbyuser = async (req, res) => {
//   const userId = req.body.userId;

//   if (!userId) return res.status(400).json({ message: "User ID is required" });

//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     const index = blog.likedBy.indexOf(userId);
//     if (index !== -1) {
//       // User already liked → Dislike
//       blog.likes = Math.max(0, blog.likes - 1);
//       blog.likedBy.splice(index, 1);
//       await blog.save();
//       return res.status(200).json({ message: "Blog disliked", likes: blog.likes });
//     } else {
//       // Like it
//       blog.likes += 1;
//       blog.likedBy.push(userId);
//       await blog.save();
//       return res.status(200).json({ message: "Blog liked", likes: blog.likes });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Error updating like", error: err.message });
//   }
// };


// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

//edit blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, author, date, tags, content } = req.body;
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        date,
        tags,
        content
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// backend/controllers/blogController.js
// backend/controllers/blogController.js
exports.likeBlog = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User must be logged in." });
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const index = blog.likedBy.findIndex(u => u.toString() === userId);

    if (index !== -1) {
      // User already liked → Dislike
      blog.likes = Math.max(0, blog.likes - 1);
      blog.likedBy.splice(index, 1);
      await blog.save();
      return res.status(200).json({ message: "Blog disliked", likes: blog.likes });
    } else {
      // Like it
      blog.likes += 1;
      blog.likedBy.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked", likes: blog.likes });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating like", error: err.message });
  }
};
