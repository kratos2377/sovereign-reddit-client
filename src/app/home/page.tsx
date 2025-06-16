'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { useSolanaWallets } from '@privy-io/react-auth'

export default function HomePage() {
  const { posts, setPosts } = useStore()

  useEffect(() => {
    // Here you would typically fetch posts from your API
    // For now, we'll use dummy data
    const dummyPosts = [
      {
        post_sov_id: '1',
        title: 'First Post',
        content: 'This is the content of the first post. It can be a longer text that describes what the post is about.',
        user_sov_id: 'user1',
        upvotes: 42,
        comments: 5,
        createdAt: new Date().toISOString(),
      },
      {
        post_sov_id: '2',
        title: 'Second Post',
        content: 'Another interesting post with some content that users might find engaging.',
        user_sov_id: 'user2',
        upvotes: 28,
        comments: 3,
        createdAt: new Date().toISOString(),
      },
    ]
    setPosts(dummyPosts)
  }, [setPosts])


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Home Feed</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.post_sov_id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
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
                {post.comments} Comments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}