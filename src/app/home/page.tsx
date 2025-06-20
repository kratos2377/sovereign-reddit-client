'use client'

import { useEffect, useState } from 'react'
import { Post, useStore } from '@/store/useStore'
import { getAccessToken, usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { BasicSigner } from '@/services/signer';
import { chainHash } from '@/services/sovereign-api';
import { LoadingModal } from '@/components/LoadingModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '@/services/api';

export default function HomePage() {
  const { user } = useStore()
  const [isLoading, setIsLoading] = useState(true);
  const { wallets } = useSolanaWallets();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserFeed = async () => {
      try {
        if (!wallets || wallets.length === 0) {
          console.error("No wallet available");
          setIsLoading(false);
          return;
        }

        const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address), chainHash);
        const bs58Key = await signer.getBs58Key();
        
        const feed =await apiService.getUserFeed({user_sov_id: bs58Key});

        console.log("feed is")
        console.log(feed)
        setPosts([...feed.feed_posts])

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user feed:", error);
        setIsLoading(false);
      }
    };

    fetchUserFeed();
  }, [wallets]);

  const handlePostClick = (postId: string) => {
    router.push(`/home/post/${postId}`);
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message="Loading your feed..." />
      <div className="max-w-4xl mx-auto p-4">
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
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-500">
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
                  {post.upvotes}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
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
                </button>
              </div>
            </div>
          ))}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found in your feed.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}