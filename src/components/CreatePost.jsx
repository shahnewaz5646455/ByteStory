'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function CreatePost({ onPostCreated }) {
  const auth = useSelector((store) => store.authStore.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Fetch user profile data to get avatar
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile with avatar
  const fetchUserProfile = async () => {
    try {
      if (!auth?._id) return;

      const response = await fetch("/api/dashboard/update-profile", {
        headers: {
          "x-user-id": auth._id,
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

  useEffect(() => {
    if (auth?._id) {
      fetchUserProfile();
    }
  }, [auth?._id]);

  // Get user avatar URL - priority: userProfile.avatar > auth.photoURL > fallback initial
  const getUserAvatar = () => {
    if (userProfile?.avatar?.url) {
      return userProfile.avatar.url;
    }
    if (auth?.photoURL) {
      return auth.photoURL;
    }
    return null;
  };

  const getUserInitial = () => {
    return auth?.name?.charAt(0)?.toUpperCase() || auth?.email?.charAt(0)?.toUpperCase() || "U";
  };

  const userAvatar = getUserAvatar();
  const userInitial = getUserInitial();

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Upload image to Cloudinary via API route
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Upload error:', data.error);
        throw new Error(data.error || 'Failed to upload image');
      }
      
      console.log('Image uploaded successfully:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    try {
      let uploadedImageUrl = '';
      
      // Upload image if selected
      if (imageFile) {
        setUploadProgress(50);
        uploadedImageUrl = await uploadImageToCloudinary(imageFile);
        setUploadProgress(75);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl: uploadedImageUrl,
          authorId: auth.email,
          authorImage: userAvatar || '',
          authorName: auth.name || 'Anonymous',
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setImagePreview('');
        setTags('');
        setUploadProgress(0);
        setIsOpen(false);
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  if (!auth) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-100 dark:border-gray-700 p-6 mb-6">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Please sign in to create posts
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Create Post Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-white font-semibold">
                {userInitial}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full px-4 py-2.5 transition-colors"
          >
            What's on your mind, {auth.name}?
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Post
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {userInitial}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {auth.name}
                    </p>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />

                {/* Content Textarea */}
                <textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="5"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                  required
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                    >
                      <CloseIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Image Upload Button */}
                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                      <ImageIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {imageFile ? 'Change Image' : 'Add Image'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Tags Input */}
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />

                {/* Upload Progress */}
                {isLoading && uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-3 p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !content.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <LoadingSpinner />
                      <span>Posting...</span>
                    </span>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );
}

function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}