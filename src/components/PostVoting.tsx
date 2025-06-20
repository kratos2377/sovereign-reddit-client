import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { useApiCall } from '../hooks/useApiCall';

interface PostVotingProps {
  post_sov_id: string;
  score: number;
  userVote?: number;
}

export const PostVoting: React.FC<PostVotingProps> = ({
  post_sov_id,
  score,
  userVote = 0,
}) => {
  const { user, likeOrDislikePost } = useStore();

  const { execute: handleVote, isLoading } = useApiCall(
    () => {
      if (!user) throw new Error('User not authenticated');
      return Promise.resolve();
    },
    {
      successMessage: 'Vote recorded successfully',
      errorMessage: 'Failed to record vote',
    }
  );

  const handleUpvote = async () => {
    if (!user) return;
    if (userVote === 1) {
      await likeOrDislikePost(user.sov_id, post_sov_id, 0); // Remove upvote
    } else {
      await likeOrDislikePost(user.sov_id, post_sov_id, 1); // Add upvote
    }
    await handleVote();
  };

  const handleDownvote = async () => {
    if (!user) return;
    if (userVote === -1) {
      await likeOrDislikePost(user.sov_id, post_sov_id, 0); // Remove downvote
    } else {
      await likeOrDislikePost(user.sov_id, post_sov_id, -1); // Add downvote
    }
    await handleVote();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        aria-label="Upvote"
        className={`p-2 rounded-md transition-colors ${
          userVote === 1 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        } ${!user || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleUpvote}
        disabled={!user || isLoading}
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
      <span className="font-medium text-gray-900 dark:text-gray-100">{score}</span>
      <button
        aria-label="Downvote"
        className={`p-2 rounded-md transition-colors ${
          userVote === -1 
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        } ${!user || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleDownvote}
        disabled={!user || isLoading}
      >
        <FaArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
}; 