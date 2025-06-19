'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaComment, FaArrowUp, FaCommentAlt } from 'react-icons/fa'
import { useStore } from '@/store/useStore'
import { LoadingModal } from '@/components/LoadingModal'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  postId: string
  postTitle: string
  createdAt: string
}

export default function ProfilePage() {
  const { user, posts, comments, getUserPosts, getUserComments } = useStore()
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        if (activeTab === 'posts') {
          await getUserPosts(user.sov_id)
        } else {
          await getUserComments(user.sov_id)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user, activeTab, getUserPosts, getUserComments])

  const handleTabChange = (tab: 'posts' | 'comments') => {
    setActiveTab(tab)
  }

  const handlePostClick = (postId: string) => {
    router.push(`/home/post/${postId}`)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoadingModal isOpen={isLoading} message={`Loading your ${activeTab}...`} />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <FaUser className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-500">User ID: {user.sov_id}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabChange('posts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'posts'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaArrowUp />
            <span>Posts</span>
          </button>
          <button
            onClick={() => handleTabChange('comments')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'comments'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCommentAlt />
            <span>Comments</span>
          </button>
        </div>

        {activeTab === 'posts' ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.post_sov_id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePostClick(post.post_sov_id)}
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
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
                    {post.upvotes} upvotes
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.comments} comments
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {!isLoading && posts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts yet. Start sharing your thoughts!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <span className="text-sm text-gray-500">On post: {comment.post_sov_id}</span>
                </div>
                <p className="text-gray-600 mb-2">{comment.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
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
                    {comment.score} points
                  </span>
                </div>
              </div>
            ))}
            {!isLoading && comments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No comments yet. Start engaging with the community!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
} 