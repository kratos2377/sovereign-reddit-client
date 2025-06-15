'use client'

import { useState } from 'react'
import { FaUser, FaComment, FaArrowUp, FaCommentAlt } from 'react-icons/fa'
import { useStore } from '@/store/useStore'

interface Comment {
  id: string
  content: string
  postId: string
  postTitle: string
  createdAt: string
}

export default function ProfilePage() {
  const { user, posts } = useStore()
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')

  // Dummy comments data
  const comments: Comment[] = [
    {
      id: '1',
      content: 'This is a great post!',
      postId: '1',
      postTitle: 'Getting Started with Next.js',
      createdAt: '2024-02-20T10:00:00Z',
    },
    {
      id: '2',
      content: 'Thanks for sharing this information.',
      postId: '2',
      postTitle: 'Understanding TypeScript',
      createdAt: '2024-02-19T15:30:00Z',
    },
  ]

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-xl text-gray-600">Please log in to view your profile</p>
//       </div>
//     )
//   }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUser className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === 'posts'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaArrowUp />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
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
              key={post.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.upvotes} upvotes</span>
                <span>{post.comments} comments</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <span className="text-sm text-gray-500">On post: {comment.postTitle}</span>
              </div>
              <p className="text-gray-600 mb-2">{comment.content}</p>
              <div className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 