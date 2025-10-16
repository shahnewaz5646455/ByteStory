import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database.Connection';
import Post from '@/app/models/Post';

export async function POST(request) {
  try {
    const { title, content, imageUrl, tags, authorId, authorName, authorImage } = await request.json();

    await connectDB();

    const newPost = new Post({
      title: title?.trim() || '',
      content: content.trim(),
      authorId: authorId || 'anonymous@example.com',
      authorName: authorName || 'Anonymous',
      authorImage: authorImage || '',
      imageUrl: imageUrl || '',
      tags: tags || [],
      likes: [],
      loves: [],
      comments: []
    });

    const savedPost = await newPost.save();

    return NextResponse.json({
      id: savedPost._id.toString(),
      title: savedPost.title,
      content: savedPost.content,
      authorId: savedPost.authorId,
      authorName: savedPost.authorName,
      authorImage: savedPost.authorImage,
      imageUrl: savedPost.imageUrl,
      tags: savedPost.tags,
      likes: savedPost.likes,
      loves: savedPost.loves,
      comments: savedPost.comments,
      createdAt: savedPost.createdAt,
      updatedAt: savedPost.updatedAt
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(20)
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
        id: comment._id.toString(),
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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}