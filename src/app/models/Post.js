import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    default: ''
  },
  likes: [{
    type: String
  }]
}, {
  timestamps: true
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: String
  }],
  loves: [{
    type: String
  }],
  comments: [CommentSchema]
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);