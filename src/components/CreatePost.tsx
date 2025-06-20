import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  sub_sov_id: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  isOpen,
  onClose,
  sub_sov_id,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useStore();

  const { execute: createPost, isLoading } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch('http://localhost:3006/create_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          user_sov_id: user.sov_id,
          sub_sov_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return response.json();
    },
    {
      successMessage: 'Post created successfully!',
      errorMessage: 'Failed to create post. Please try again.',
      onSuccess: () => {
        setTitle('');
        setContent('');
        onClose();
      },
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost();
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create Post</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Write your post content here..."
                  rows={6}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <LoadingModal
        isOpen={isLoading}
        message="Creating your post..."
      />
    </>
  );
}; 