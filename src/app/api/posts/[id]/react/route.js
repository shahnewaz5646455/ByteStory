import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database.Connection';
import Post from '@/app/models/Post';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // Get user email from headers (consistent with your comments API)
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reactionType } = await request.json();

    if (!['like', 'love'].includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Facebook-style reaction logic
    const oppositeReaction = reactionType === 'like' ? 'love' : 'like';
    
    // Check if user already has this reaction
    const hasCurrentReaction = post[`${reactionType}s`].includes(userEmail);
    const hasOppositeReaction = post[`${oppositeReaction}s`].includes(userEmail);

    if (hasCurrentReaction) {
      // Remove current reaction if already exists (toggle off)
      post[`${reactionType}s`] = post[`${reactionType}s`].filter(
        email => email !== userEmail
      );
    } else {
      // Remove opposite reaction if exists
      post[`${oppositeReaction}s`] = post[`${oppositeReaction}s`].filter(
        email => email !== userEmail
      );
      // Add new reaction
      post[`${reactionType}s`].push(userEmail);
    }

    await post.save();

    return NextResponse.json({
      message: 'Reaction updated',
      hasLike: post.likes.includes(userEmail),
      hasLove: post.loves.includes(userEmail),
      likes: post.likes,
      loves: post.loves
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}