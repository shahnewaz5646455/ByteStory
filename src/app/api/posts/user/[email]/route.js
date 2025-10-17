import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database.Connection';
import Post from '@/app/models/Post';

export async function GET(request, { params }) {
  try {
    const { email } = params;
    
    await connectDB();

    const posts = await Post.find({ authorId: email })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      authorImage: post.authorImage,
      imageUrl: post.imageUrl,
      tags: post.tags,
      likes: post.likes,
      loves: post.loves,
      comments: post.comments.map(comment => ({
        id: comment._id?.toString(),
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorImage: comment.authorImage,
        likes: comment.likes,
        createdAt: comment.createdAt
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}