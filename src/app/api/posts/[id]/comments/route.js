import Post from '@/app/models/Post';
import { connectDB } from '@/lib/database.Connection';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // Get user email from headers (set by your frontend)
    const userEmail = request.headers.get('x-user-email');
    const userName = request.headers.get('x-user-name');
    const userPhoto = request.headers.get('x-user-photo');
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Optionally fetch user avatar from database
    let authorImage = userPhoto || '';
    try {
      const User = require('@/app/models/User');
      const userProfile = await User.findOne({ email: userEmail });
      if (userProfile?.avatar?.url) {
        authorImage = userProfile.avatar.url;
      }
    } catch (err) {
      console.log('Could not fetch user avatar:', err.message);
    }

    const newComment = {
      content: content.trim(),
      authorId: userEmail,
      authorName: userName || 'Anonymous',
      authorImage: authorImage,
      likes: []
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];

    return NextResponse.json({
      id: savedComment._id?.toString() || savedComment._id,
      content: savedComment.content,
      authorId: savedComment.authorId,
      authorName: savedComment.authorName,
      authorImage: savedComment.authorImage,
      likes: savedComment.likes || [],
      createdAt: savedComment.createdAt
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}