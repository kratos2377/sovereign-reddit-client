'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'

export default function CreatePostPage() {
  const router = useRouter()
  const { setPosts, posts, user, userSubs, fetchUserSubs } = useStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSub, setSelectedSub] = useState('')
  const [subsLoading, setSubsLoading] = useState(false)

  useEffect(() => {
    const fetchSubs = async () => {
      if (user && user.sov_id) {
        setSubsLoading(true)
        await fetchUserSubs(user.sov_id)
        setSubsLoading(false)
      }
    }
    fetchSubs()
  }, [user, fetchUserSubs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically make an API call to create the post
      // For now, we'll just add it to the local state
      const newPost = {
        post_sov_id: Date.now().toString(),
        title,
        content,
        user_sov_id: user?.sov_id || '',
        upvotes: 0,
        downvotes: 0,
        score: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sub_sov_id: selectedSub,
      }

      setPosts([newPost, ...posts])
      router.push('/home')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subreddit" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Choose Subreddit
          </label>
          {subsLoading ? (
            <div className="text-gray-500 dark:text-gray-400">Loading subreddits...</div>
          ) : (
            <select
              id="subreddit"
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              required
              className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-red-400 transition-colors"
            >
              <option value="" disabled>
                Select a subreddit
              </option>
              {userSubs.map((sub) => (
                <option key={sub.sub_sov_id} value={sub.sub_sov_id}>
                  {sub.sub_sov_id}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-red-400 transition-colors"
            placeholder="Post title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-red-400 transition-colors"
            placeholder="What's on your mind?"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
} 