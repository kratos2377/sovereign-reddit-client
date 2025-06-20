'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Post, Comment, useStore } from '@/store/useStore'
import { useSolanaWallets } from "@privy-io/react-auth";
import { BasicSigner } from '@/services/signer';
import { chainHash } from '@/services/sovereign-api';
import { LoadingModal } from '@/components/LoadingModal';
import { apiService } from '@/services/api';
import Link from 'next/link';

export default function PostPage() {
  const params = useParams();
  const post_id = params?.post_id as string;
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { wallets } = useSolanaWallets();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (!post_id) {
          console.error("No post ID provided");
          setIsLoading(false);
          return;
        }

        // Fetch post information
        try {
          const postData = await apiService.fetchModel({ 
            schema: "post", 
            primaryKey: post_id 
          });
          if (postData.data.models && postData.data.models.length > 0) {
            setPost(postData.data.models[0]);
          }
        } catch (error) {
          console.error("Error fetching post info:", error);
        }

        // Fetch comments for this post using apiService directly
        const commentsData = await apiService.getPostComments({ post_sov_id: post_id });
        setComments(commentsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [post_id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !post_id) return;

    setIsSubmittingComment(true);
    try {
      await apiService.addComment({ post_sov_id: post_id, user_sov_id: user.sov_id, content: newComment });
      setNewComment('');
      // Refresh comments
      const commentsData = await apiService.getPostComments({ post_sov_id: post_id });
      setComments(commentsData);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVote = async (value: number) => {
    if (!user || !post_id || isVoting) return;

    setIsVoting(true);
    try {
      await apiService.likeOrDislikePost({ user_sov_id: user.sov_id, post_sov_id: post_id, value });
      // Refresh post data to get updated vote counts
      const postData = await apiService.fetchModel({ schema: "post", primaryKey: post_id });
      if (postData.data.models && postData.data.models.length > 0) {
        setPost(postData.data.models[0]);
      }
    } catch (error) {
      console.error("Error voting on post:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message="Loading post..." />
      <div className="max-w-4xl mx-auto p-4">
        {post && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">Posted by {post.user_sov_id}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleVote(1)}
                  disabled={isVoting}
                  className="flex items-center gap-1 hover:text-blue-500 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span>{post.upvotes}</span>
                <button 
                  onClick={() => handleVote(-1)}
                  disabled={isVoting}
                  className="flex items-center gap-1 hover:text-red-500 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span>{post.downvotes}</span>
              </div>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Comment Form */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">Posted by {comment.user_sov_id}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {comment.score}
                </button>
              </div>
            </div>
          ))}
          {!isLoading && comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 