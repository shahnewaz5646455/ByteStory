"use client";

import { showToast } from "@/lib/showToast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Post({ post, onUpdate, onDelete }) {
  const session = useSelector((store) => store.authStore.auth);
  const [isLiked, setIsLiked] = useState(post.likes.includes(session?.email));
  const [isLoved, setIsLoved] = useState(post.loves.includes(session?.email));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    tags: post.tags.join(", "),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  // Add these state variables near your other state declarations
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Add this function to handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEditData({ ...editData, imageUrl: "" });
  };

  // Update the handleEdit function to handle image upload
  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = editData.imageUrl;

      // Upload new image if selected
      if (selectedImage) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload image");
        }
        setIsUploading(false);
      }

      // Update the post with the new image URL
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({
          ...editData,
          imageUrl: imageUrl,
          tags: editData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
        setIsEditing(false);
        setShowMenu(false);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert(error.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  // Check if content needs "See More"
  const needsExpansion = post.content && post.content.length > 150;
  const displayContent =
    expanded || !needsExpansion
      ? post.content
      : `${post.content.substring(0, 150)}...`;

  // Generate share URL when component mounts
  useEffect(() => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const postShareUrl = `${currentUrl.split("?")[0]}?post=${post.id}`;
    setShareUrl(postShareUrl);
  }, [post.id]);

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
        },
        body: JSON.stringify({ reactionType }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.hasLike);
        setIsLoved(data.hasLove);
        const updatedPost = {
          ...post,
          likes: data.likes,
          loves: data.loves,
        };
        onUpdate(updatedPost);
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert(error.message || "Failed to update reaction");
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      alert("Failed to update reaction. Please try again.");
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": session.email,
          "x-user-name": session.name || "Anonymous",
          "x-user-photo": session.photoURL || "",
        },
        body: JSON.stringify({
          content: commentText,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        const updatedPost = {
          ...post,
          comments: [...post.comments, newComment],
        };
        onUpdate(updatedPost);
        setCommentText("");
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert(error.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("error", "Failed to post comment. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-2">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={async () => {
                closeToast();
                setIsLoading(true);
                try {
                  const response = await fetch(`/api/posts/${post.id}`, {
                    method: "DELETE",
                    headers: {
                      "x-user-email": session.email, // ✅ এই লাইনটা add করুন
                    },
                  });

                  if (response.ok) {
                    onDelete(post.id);

                    showToast("success", "Post moved to recycle bin"); // ✅ Message change
                  } else {
                    const error = await response.json();
                    toast.error(error.error || "Failed to delete post");
                  }
                } catch (error) {
                  toast.error("Failed to delete post. Please try again.");
                } finally {
                  setIsLoading(false);
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };
  const handleShare = async () => {
    if (!session) {
      showToast("error", "Please log in to share posts");
      return;
    }

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title || "Check out this post",
          text: post.content?.substring(0, 100) + "...",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowShareOptions(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing:", error);
        await navigator.clipboard.writeText(shareUrl);
        setShowShareOptions(true);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleCustomShare = (platform) => {
    const text = encodeURIComponent(post.title || "Check out this post");
    const url = encodeURIComponent(shareUrl);

    let shareUrlMap = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };

    if (shareUrlMap[platform]) {
      window.open(shareUrlMap[platform], "_blank", "width=600,height=400");
    }

    setShowShareOptions(false);
  };

  const formatTime = (date) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - postDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return postDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Post Header */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Author Avatar */}
            {getUserAvatar() && !imageError ? (
              <img
                src={getUserAvatar()}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-white dark:border-gray-700 shadow-sm">
                {post.authorName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {post.authorName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <span>{formatTime(post.createdAt)}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <GlobeIcon className="w-3 h-3 mr-1" />
                  Public
                </span>
              </p>
            </div>
          </div>

          {session?.email === post.authorId && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <MoreIcon className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-700/95">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    <DeleteIcon className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEdit} className="mt-4 space-y-4">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Post title"
            />
            <textarea
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="What's on your mind?"
              required
            />

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Post Image
              </label>

              {/* Current Image Preview */}
              {post.imageUrl && !selectedImage && (
                <div className="relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Current Image:
                  </p>
                  <img
                    src={post.imageUrl}
                    alt="Current post"
                    className="w-full max-w-xs h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setEditData({ ...editData, imageUrl: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* New Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    New Image Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* File Upload Input */}
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                    <svg
                      className="w-8 h-8 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedImage ? "Change Image" : "Upload New Image"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>

                {/* Or use URL option */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
                    Or enter URL:
                  </p>
                  <input
                    type="url"
                    value={editData.imageUrl}
                    onChange={(e) =>
                      setEditData({ ...editData, imageUrl: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedImage}
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Uploading image...</span>
                </div>
              )}
            </div>

            <input
              type="text"
              value={editData.tags}
              onChange={(e) =>
                setEditData({ ...editData, tags: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Tags (comma separated)"
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    title: post.title,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    tags: post.tags.join(", "),
                  });
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                disabled={isLoading || isUploading}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {post.title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2 leading-tight">
                {post.title}
              </h2>
            )}
            <div className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
              <p className="whitespace-pre-wrap break-words">
                {displayContent}
              </p>
              {needsExpansion && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm mt-2 transition-colors"
                >
                  {expanded ? "See Less" : "See More"}
                </button>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs rounded-full font-medium shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className={`w-full h-auto transition-all duration-500 cursor-pointer ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    } ${imageExpanded ? "object-contain" : "object-cover"}`}
                    style={{
                      maxHeight: imageExpanded ? "none" : "500px",
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onClick={() => setImageExpanded(!imageExpanded)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  <button
                    onClick={() => setImageExpanded(!imageExpanded)}
                    className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  >
                    {imageExpanded ? (
                      <ZoomOutIcon className="w-4 h-4" />
                    ) : (
                      <ZoomInIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Stats */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              {post.likes.length > 0 && (
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-sm">
                  <LikeIcon className="w-3 h-3 text-white" filled={true} />
                </div>
              )}
              {post.loves.length > 0 && (
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-sm">
                  <LoveIcon className="w-3 h-3 text-white" filled={true} />
                </div>
              )}
            </div>
            <span className="font-medium">
              {post.likes.length + post.loves.length}
            </span>
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {post.comments.length} comments
          </button>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-3 py-2 flex justify-between border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => handleReaction("like")}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg flex-1 justify-center transition-all duration-300 disabled:opacity-50 group ${
            isLiked
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <div
            className={`transform transition-transform group-hover:scale-110 ${
              isLiked ? "scale-110" : ""
            }`}
          >
            <LikeIcon className="w-5 h-5" filled={isLiked} />
          </div>
          <span
            className={`font-medium ${
              isLiked ? "text-blue-600 dark:text-blue-400" : ""
            }`}
          >
            Like
          </span>
        </button>

        <button
          onClick={() => handleReaction("love")}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg flex-1 justify-center transition-all duration-300 disabled:opacity-50 group ${
            isLoved
              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <div
            className={`transform transition-transform group-hover:scale-110 ${
              isLoved ? "scale-110" : ""
            }`}
          >
            <LoveIcon className="w-5 h-5" filled={isLoved} />
          </div>
          <span
            className={`font-medium ${
              isLoved ? "text-red-600 dark:text-red-400" : ""
            }`}
          >
            Love
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-3 rounded-lg flex-1 justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 group"
        >
          <div className="transform transition-transform group-hover:scale-110">
            <CommentIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Comment</span>
        </button>

        <button
          onClick={handleShare}
          disabled={isLoading || isSharing}
          className="flex items-center space-x-2 px-4 py-3 rounded-lg flex-1 justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 group"
        >
          <div className="transform transition-transform group-hover:scale-110">
            <ShareIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">
            {isSharing ? "Sharing..." : "Share"}
          </span>
        </button>
      </div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Share Post
              </h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-sm">
              Post link copied to clipboard! Share it on:
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  platform: "twitter",
                  icon: TwitterIcon,
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                  textColor: "text-blue-500",
                },
                {
                  platform: "facebook",
                  icon: FacebookIcon,
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                  textColor: "text-blue-600",
                },
                {
                  platform: "linkedin",
                  icon: LinkedInIcon,
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                  textColor: "text-blue-700",
                },
                {
                  platform: "whatsapp",
                  icon: WhatsAppIcon,
                  color: "bg-green-50 dark:bg-green-900/20",
                  hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
                  textColor: "text-green-500",
                },
                {
                  platform: "telegram",
                  icon: TelegramIcon,
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                  textColor: "text-blue-400",
                },
              ].map(
                ({ platform, icon: Icon, color, hoverColor, textColor }) => (
                  <button
                    key={platform}
                    onClick={() => handleCustomShare(platform)}
                    className={`flex flex-col items-center p-4 ${color} ${hoverColor} rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md`}
                  >
                    <Icon className={`w-7 h-7 ${textColor} mb-2`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {platform}
                    </span>
                  </button>
                )
              )}

              <button
                onClick={() =>
                  navigator.clipboard.writeText(shareUrl).then(() => {
                    alert("Link copied to clipboard again!");
                    setShowShareOptions(false);
                  })
                }
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <CopyIcon className="w-7 h-7 text-gray-600 dark:text-gray-300 mb-2" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Copy Link
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-750">
          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex space-x-3 mb-6">
            <div className="flex-shrink-0">
              {session?.photoURL ? (
                <img
                  src={session.photoURL}
                  alt={session?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                style={{ display: session?.photoURL ? "none" : "flex" }}
              >
                {session?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                disabled={isLoading}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !commentText.trim()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all transform hover:-translate-y-0.5 flex-shrink-0 self-start mt-2"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group">
                <div className="flex-shrink-0">
                  {comment.authorImage ? (
                    <img
                      src={comment.authorImage}
                      alt={comment.authorName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-9 h-9 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                    style={{ display: comment.authorImage ? "none" : "flex" }}
                  >
                    {comment.authorName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-all">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {comment.authorName}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-2 text-xs text-gray-500 dark:text-gray-400">
                    <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                      Like
                    </button>
                    <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
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

// Enhanced Icon Components
function MoreIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function DeleteIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function LikeIcon({ className, filled }) {
  return (
    <svg
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
  );
}

function LoveIcon({ className, filled }) {
  return (
    <svg
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function CommentIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ShareIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
      />
    </svg>
  );
}

function ZoomInIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
      />
    </svg>
  );
}

function ZoomOutIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
      />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.495 3.09" />
    </svg>
  );
}

function TelegramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.191c-.175.761-.836 2.607-1.65 5.072-.847 2.563-1.287 3.807-1.934 3.807-.568 0-.891-.527-1.377-1.037-.387-.406-1.42-1.194-2.076-1.603-.872-.548-.374-.848.231-1.341.155-.127 2.814-2.434 2.865-2.64.005-.026.009-.118-.135-.118-.195 0-1.123.198-2.006.346-.765.128-1.458.187-1.51.394-.046.187.406.371 1.186.72 1.285.569 1.635.838 2.432 1.338.18.113.327.166.447.166.619 0 1.016-.572 2.141-2.059 1.101-1.456 1.587-2.466 1.772-2.766.163-.266.036-.401-.367-.401-.653 0-1.194.183-2.477.61-1.25.416-1.945.621-2.193.621-.575 0-.525-.265.075-.607.351-.201 2.021-.846 3.5-1.406 1.645-.623 2.155-.914 2.536-.914.549 0 .786.257.715.771z" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}
