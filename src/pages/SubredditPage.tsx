import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CreatePost } from '../components/CreatePost';
import { CommentSection } from '../components/CommentSection';
import { PostVoting } from '../components/PostVoting';
import { LoadingModal } from '../components/LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

export const SubredditPage: React.FC = () => {
  const { sub_sov_id } = useParams<{ sub_sov_id: string }>();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { user, posts, getSubredditPosts } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchPosts } = useApiCall(
    async () => {
      if (!sub_sov_id) throw new Error('Subreddit ID is required');
      await getSubredditPosts(sub_sov_id);
    },
    {
      successMessage: 'Posts loaded successfully',
      errorMessage: 'Failed to load posts',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  useEffect(() => {
    fetchPosts();
  }, [sub_sov_id]);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  if (!sub_sov_id) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <p className="text-gray-700 dark:text-gray-300">Subreddit not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Subreddit Posts
          </h1>
          {user && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={openCreatePost}
            >
              Create Post
            </button>
          )}
        </div>

        {isLoading ? (
          <LoadingModal isOpen={true} message="Loading posts..." />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.post_sov_id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {post.title}
                  </h2>
                  <PostVoting
                    post_sov_id={post.post_sov_id}
                    score={post.score}
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posted by {post.user_sov_id}  comments
                </p>
                <CommentSection post_sov_id={post.post_sov_id} />
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No posts yet. Be the first to post!
              </p>
            )}
          </div>
        )}
      </div>

      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={closeCreatePost}
        sub_sov_id={sub_sov_id}
      />
    </div>
  );
}; 