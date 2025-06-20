import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';
import { PostVoting } from './PostVoting';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  user_sov_id: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user_sov_id }) => {
  const { posts, comments, getUserPosts, getUserComments } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const { execute: fetchUserData } = useApiCall(
    async () => {
      if (activeTab === 0) {
        await getUserPosts(user_sov_id);
      } else {
        await getUserComments(user_sov_id);
      }
    },
    {
      successMessage: 'Data loaded successfully',
      errorMessage: 'Failed to load data',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  useEffect(() => {
    setIsLoading(true);
    fetchUserData();
  }, [user_sov_id, activeTab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/home/post/${postId}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            User Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">User ID: {user_sov_id}</p>
        </div>

        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange(0)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 0
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => handleTabChange(1)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 1
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Comments
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 0 && (
              <div>
                {isLoading ? (
                  <LoadingModal isOpen={true} message="Loading posts..." />
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.post_sov_id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePostClick(post.post_sov_id)}
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>
                        <PostVoting
                          post_sov_id={post.post_sov_id}
                          score={post.score}
                        />
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No posts yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 1 && (
              <div>
                {isLoading ? (
                  <LoadingModal isOpen={true} message="Loading comments..." />
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800"
                      >
                        <p className="mb-2 text-gray-900 dark:text-gray-100">{comment.content}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Score: {comment.score}
                        </p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No comments yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 