'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Post({ post, onUpdate, onDelete }) {
  const session = useSelector((store) => store.authStore.auth);
  const [isLiked, setIsLiked] = useState(post.likes.includes(session?.email));
  const [isLoved, setIsLoved] = useState(post.loves.includes(session?.email));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    tags: post.tags.join(', ')
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
// Add custom share options modal state
const [showShareOptions, setShowShareOptions] = useState(false);
  // Add this state variable near your other state declarations
const [isSharing, setIsSharing] = useState(false);
const [shareUrl, setShareUrl] = useState('');

// Generate share URL when component mounts
useEffect(() => {
  // You can customize this URL based on your app's routing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const postShareUrl = `${currentUrl.split('?')[0]}?post=${post.id}`;
  setShareUrl(postShareUrl);
}, [post.id]);

// Add this function near your other handler functions
const handleShare = async () => {
  if (!session) {
    alert('Please log in to share posts');
    return;
  }

  setIsSharing(true);
  
  try {
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      await navigator.share({
        title: post.title || 'Check out this post',
        text: post.content?.substring(0, 100) + '...',
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard and show options
      await navigator.clipboard.writeText(shareUrl);
      
      // Show custom share options modal
      setShowShareOptions(true);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      // Fallback to clipboard if share fails
      await navigator.clipboard.writeText(shareUrl);
      setShowShareOptions(true);
    }
  } finally {
    setIsSharing(false);
  }
};



// Custom share options handler
const handleCustomShare = (platform) => {
  const text = encodeURIComponent(post.title || 'Check out this post');
  const url = encodeURIComponent(shareUrl);
  
  let shareUrlMap = {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
  };

  if (shareUrlMap[platform]) {
    window.open(shareUrlMap[platform], '_blank', 'width=600,height=400');
  }
  
  setShowShareOptions(false);
};

  // Fetch author's profile info
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!post.authorId) return;
        const response = await fetch(`/api/dashboard/update-profile`, {
          headers: {
            "x-user-id": post.authorId,
          },
        });
        const data = await response.json();
        if (data.success && data.user) {
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [post.authorId]);

  // Update reactions when post changes
  useEffect(() => {
    setIsLiked(post.likes.includes(session?.email));
    setIsLoved(post.loves.includes(session?.email));
  }, [post.likes, post.loves, session?.email]);

  // Avatar helper
  const getUserAvatar = () => {
    if (userProfile?.avatar?.url) return userProfile.avatar.url;
    if (post.authorImage) return post.authorImage;
    return null;
  };

 const handleReaction = async (reactionType) => {
  if (!session) return;

  setIsLoading(true);
  try {
    const response = await fetch(`/api/posts/${post.id}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': session.email,
      },
      body: JSON.stringify({ reactionType }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update local state based on API response
      setIsLiked(data.hasLike);
      setIsLoved(data.hasLove);
      
      // Update the post with new reaction arrays
      const updatedPost = {
        ...post,
        likes: data.likes,
        loves: data.loves
      };
      onUpdate(updatedPost);
    } else {
      const error = await response.json();
      console.error('Error response:', error);
      alert(error.message || 'Failed to update reaction');
    }
  } catch (error) {
    console.error('Error updating reaction:', error);
    alert('Failed to update reaction. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleComment = async (e) => {
  e.preventDefault();
  if (!session || !commentText.trim()) return;

  setIsLoading(true);
  try {
    const response = await fetch(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': session.email,
        'x-user-name': session.name || 'Anonymous',
        'x-user-photo': session.photoURL || '',
      },
      body: JSON.stringify({ 
        content: commentText
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
      const updatedPost = {
        ...post,
        comments: [...post.comments, newComment]
      };
      onUpdate(updatedPost);
      setCommentText('');
    } else {
      const error = await response.json();
      console.error('Error response:', error);
      alert(error.message || 'Failed to post comment');
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    alert('Failed to post comment. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleEdit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': session.email, // Add this header
      },
      body: JSON.stringify({
        ...editData,
        tags: editData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      onUpdate(updatedPost);
      setIsEditing(false);
      setShowMenu(false);
    } else {
      const error = await response.json();
      console.error('Error response:', error);
      alert(error.error || 'Failed to update post');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this post?')) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': session.email, // Add this header
        },
      });

      if (response.ok) {
        onDelete(post.id);
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert(error.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
};

  const formatTime = (date) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - postDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return postDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-100 dark:border-gray-700 mb-6">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Author Avatar */}
            {getUserAvatar() && !imageError ? (
              <img 
                src={getUserAvatar()} 
                alt={post.authorName} 
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border border-gray-200 dark:border-gray-700">
                {post.authorName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.authorName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(post.createdAt)}
              </p>
            </div>
          </div>
          
          {session?.email === post.authorId && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 disabled:opacity-50"
              >
                <MoreIcon className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEdit} className="mt-4 space-y-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Post title"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              rows="3"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="What's on your mind?"
              required
            />
            <input
              type="url"
              value={editData.imageUrl}
              onChange={(e) => setEditData({...editData, imageUrl: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({...editData, tags: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tags (comma separated)"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    title: post.title,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    tags: post.tags.join(', ')
                  });
                }}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {post.title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                {post.title}
              </h2>
            )}
            <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
              {post.content}
            </p>
             {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
            
           
          </>
        )}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-b border-gray-100 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              {post.likes.length > 0 && (
                <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <LikeIcon className="w-3 h-3 text-white" filled={true} />
                </div>
              )}
              {post.loves.length > 0 && (
                <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <LoveIcon className="w-3 h-3 text-white" filled={true} />
                </div>
              )}
            </div>
            <span>{post.likes.length + post.loves.length}</span>
          </div>
          <span>{post.comments.length} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex justify-between">
        <button
          onClick={() => handleReaction('like')}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 justify-center transition-colors disabled:opacity-50 ${
            isLiked 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <LikeIcon className="w-5 h-5" filled={isLiked} />
          <span>Like</span>
        </button>
        
        <button
          onClick={() => handleReaction('love')}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 justify-center transition-colors disabled:opacity-50 ${
            isLoved 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <LoveIcon className="w-5 h-5" filled={isLoved} />
          <span>Love</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <CommentIcon className="w-5 h-5" />
          <span>Comment</span>
        </button>
        
       <button 
        onClick={handleShare}
        disabled={isLoading || isSharing}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <ShareIcon className="w-5 h-5" />
        <span>{isSharing ? 'Sharing...' : 'Share'}</span>
      </button>
      {/* Share Options Modal */}
{showShareOptions && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Share Post
        </h3>
        <button
          onClick={() => setShowShareOptions(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        Post link copied to clipboard! Share it on:
      </p>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => handleCustomShare('twitter')}
          className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <TwitterIcon className="w-6 h-6 text-blue-500" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">Twitter</span>
        </button>
        
        <button
          onClick={() => handleCustomShare('facebook')}
          className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <FacebookIcon className="w-6 h-6 text-blue-600" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">Facebook</span>
        </button>
        
        <button
          onClick={() => handleCustomShare('linkedin')}
          className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <LinkedInIcon className="w-6 h-6 text-blue-700" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">LinkedIn</span>
        </button>
        
        <button
          onClick={() => handleCustomShare('whatsapp')}
          className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <WhatsAppIcon className="w-6 h-6 text-green-500" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">WhatsApp</span>
        </button>
        
        <button
          onClick={() => handleCustomShare('telegram')}
          className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <TelegramIcon className="w-6 h-6 text-blue-400" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">Telegram</span>
        </button>
        
        <button
          onClick={() => navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard again!');
            setShowShareOptions(false);
          })}
          className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <CopyIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">Copy Link</span>
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => setShowShareOptions(false)}
          className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex space-x-3 mb-4">
            {session?.photoURL ? (
              <img
                src={session.photoURL}
                alt={session?.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
              style={{ display: session?.photoURL ? 'none' : 'flex' }}
            >
              {session?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !commentText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                {comment.authorImage ? (
                  <img
                    src={comment.authorImage}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                  style={{ display: comment.authorImage ? 'none' : 'flex' }}
                >
                  {comment.authorName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {comment.authorName}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 ml-3 text-xs text-gray-500 dark:text-gray-400">
                    <button className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Like
                    </button>
                    <button className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Icon Components
function MoreIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  );
}

function LikeIcon({ className, filled }) {
  return (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
    </svg>
  );
}

function LoveIcon({ className, filled }) {
  return (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  );
}

function CommentIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
  );
}

function ShareIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
    </svg>
  );
}
function TwitterIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.495 3.09"/>
    </svg>
  );
}
