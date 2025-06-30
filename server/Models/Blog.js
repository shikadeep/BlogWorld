const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  content: { type: String },
  image: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'LoginUser' }
},
{
  timestamps : true
});

module.exports = mongoose.model('Blog', blogSchema);
