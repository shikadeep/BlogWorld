// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import Superscript from '@tiptap/extension-superscript';
// import Subscript from '@tiptap/extension-subscript';
// import Highlight from '@tiptap/extension-highlight';
// import TextAlign from '@tiptap/extension-text-align';
// import LinkExtension from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Placeholder from '@tiptap/extension-placeholder';
// import CustomMenuBar from '../components/Menu/CustomMenuBar';
// import { Link } from 'react-router-dom';

// const BlogModalPage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     date: '',
//     author: '',
//     tags: '',
//     content: '',
//   });
//   const [blogs, setBlogs] = useState([]);
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Superscript,
//       Subscript,
//       Highlight,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//       LinkExtension.configure({ openOnClick: false }),
//       Image,
//       Placeholder.configure({ placeholder: 'Start writing your post here...' }),
//     ],
//     content: '',
//     onUpdate: ({ editor }) => {
//       setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
//     },
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImagePreview(null);
//     document.getElementById('fileUpload').value = '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append('title', formData.title);
//     data.append('date', formData.date);
//     data.append('author', formData.author);
//     data.append('tags', formData.tags);
//     data.append('content', formData.content);
//     if (image) data.append('image', image);

//     try {
//       await axios.post(`${import.meta.env.VITE_BACKEND}/api/blogs`, data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })

//       alert('Blog uploaded!');
//       setShowModal(false);
//       setFormData({ title: '', date: '', author: '', tags: '', content: '' });
//       setImage(null);
//       setImagePreview(null);
//       if (editor) editor.commands.setContent('');
//       fetchBlogs();
//     } catch (err) {
//       console.error('Upload failed', err);
//       alert('Failed to upload blog.');
//     }
//   };

//   const fetchBlogs = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/blogs`);
//       setBlogs(res.data);
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   return (
//     <div className="bg-[#f0f2f5] min-h-screen p-4">
//       <div className="text-right mb-4">
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Upload Blog
//         </button>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 overflow-y-auto">
//           <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl mt-10 mb-10 relative overflow-y-auto max-h-[90vh]">

//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-500"
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-bold mb-4 text-center">Create Blog Post</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Title"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <div className="flex gap-4">
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-1/2 p-2 border rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   placeholder="Author"
//                   className="w-1/2 p-2 border rounded"
//                   required
//                 />
//               </div>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="Tags (comma-separated)"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 id="fileUpload"
//                 onChange={handleImageChange}
//                 className="w-full border rounded p-2"
//               />
//               {imagePreview && (
//                 <div className="relative mt-2">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-64 object-cover border"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemoveImage}
//                     className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               )}
//               <div className="border rounded p-2">
//                 <CustomMenuBar editor={editor} />
//                 <EditorContent
//                   editor={editor}
//                   className="prose max-w-none min-h-[150px]"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Blog List */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold text-center mb-6">All Blogs</h2>
//         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {blogs.length === 0 ? (
//             <p className="text-center col-span-full">No blogs available</p>
//           ) : (
//             blogs.map((blog) => (
//               <Link
//                 key={blog._id}
//                 to={`/dashboard/blogdetail/${blog._id}`}
//                 state={blog}
//               >
//                 <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
//                   <div className="text-sm text-gray-500 mb-2">
//                     {new Date(blog.date).toLocaleDateString()} • {blog.author}
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">
//                     {blog.title.length > 40
//                       ? blog.title.substring(0, 40) + '...'
//                       : blog.title}
//                   </h3>
//                   {blog.image && (
//                     <img
//                       src={`${import.meta.env.VITE_BACKEND}/${blog.image}`}
//                       alt={blog.title}
//                       className="w-full h-48 object-cover rounded"
//                     />
//                   )}
//                   <p className="text-sm mt-2 text-gray-700">
//                     {Array.isArray(blog.tags)
//                       ? blog.tags[0]
//                       : blog.tags.split(',')[0]}
//                   </p>
//                 </div>
//               </Link>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogModalPage;
