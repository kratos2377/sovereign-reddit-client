'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Post, Subreddit, useStore } from '@/store/useStore'
import { useSolanaWallets } from "@privy-io/react-auth";
import { BasicSigner } from '@/services/signer';
import { chainHash } from '@/services/sovereign-api';
import { LoadingModal } from '@/components/LoadingModal';
import { apiService } from '@/services/api';
import Link from 'next/link';


export default function SubredditPage() {
  const params = useParams();
  const sub_id = params?.sub_id as string;
  const { user } = useStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subreddit, setSubreddit] = useState<Subreddit | null>(null);
  const [votingPostId, setVotingPostId] = useState<string | null>(null);
  const { wallets } = useSolanaWallets();
  const router = useRouter();

  useEffect(() => {
    const fetchSubredditData = async () => {
      try {
        if (!sub_id) {
          console.error("No subreddit ID provided");
          setIsLoading(false);
          return;
        }

        // Fetch subreddit information
        try {
          const subredditData = await apiService.fetchModel({ 
            schema: "subreddit", 
            primaryKey: sub_id 
          });
          if (subredditData.data.models && subredditData.data.models.length > 0) {
            setSubreddit(subredditData.data.models[0]);
          }
        } catch (error) {
          console.error("Error fetching subreddit info:", error);
        }

        // Fetch posts for this subreddit using apiService directly
        const postsData = await apiService.getSubredditPosts({ sub_sov_id: sub_id });
        setPosts(postsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subreddit data:", error);
        setIsLoading(false);
      }
    };

    fetchSubredditData();
  }, [sub_id]);

  const handleVote = async (postId: string, value: number) => {
    if (!user || !postId || votingPostId) return;

    setVotingPostId(postId);
    try {
      await apiService.likeOrDislikePost({ user_sov_id: user.sov_id, post_sov_id: postId, value });
      // Refresh posts to get updated vote counts
      const postsData = await apiService.getSubredditPosts({ sub_sov_id: sub_id });
      setPosts(postsData);
    } catch (error) {
      console.error("Error voting on post:", error);
    } finally {
      setVotingPostId(null);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/home/post/${postId}`);
  };

  const handleSubredditClick = () => {
    if (subreddit) {
      router.push(`/home/sub/${subreddit.sub_sov_id}`);
    }
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message="Loading subreddit..." />
      <div className="max-w-4xl mx-auto p-4">
        {subreddit && (
          <div 
            className="bg-white rounded-lg shadow p-6 mb-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleSubredditClick}
          >
            <h1 className="text-3xl font-bold mb-2">r/{subreddit.subname}</h1>
            <p className="text-gray-600 mb-4">{subreddit.sub_description}</p>
            <div className="text-sm text-gray-500">
              Created {new Date(subreddit.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}

        <div className="space-y-4 max-h-screen overflow-y-auto">
          {posts.map((post) => (
            <div
              key={post.post_sov_id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePostClick(post.post_sov_id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">Posted by {post.user_sov_id}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.post_sov_id, 1);
                    }}
                    disabled={votingPostId === post.post_sov_id}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(post.post_sov_id, -1);
                    }}
                    disabled={votingPostId === post.post_sov_id}
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
                  {post.comments} Comments
                </span>
              </div>
            </div>
          ))}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found in this subreddit.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 