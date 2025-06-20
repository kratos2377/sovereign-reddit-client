import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface CommentSectionProps {
  post_sov_id: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ post_sov_id }) => {
  const [commentContent, setCommentContent] = useState('');
  const { user, comments, getPostComments, addComment } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchComments } = useApiCall(
    async () => {
      await getPostComments(post_sov_id);
    },
    {
      successMessage: 'Comments loaded successfully',
      errorMessage: 'Failed to load comments',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  const { execute: submitComment, isLoading: isSubmitting } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await addComment(post_sov_id, user.sov_id, commentContent);
      setCommentContent('');
      await fetchComments();
    },
    {
      successMessage: 'Comment added successfully',
      errorMessage: 'Failed to add comment',
    }
  );

  React.useEffect(() => {
    fetchComments();
  }, [post_sov_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Comments
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add a comment
            </label>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your comment here..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 mb-2 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </div>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <LoadingModal isOpen={true} message="Loading comments..." />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800"
            >
              <p className="text-gray-900 dark:text-gray-100">{comment.content}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Posted by {comment.user_sov_id} • {comment.score} points
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 