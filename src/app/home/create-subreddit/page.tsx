'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateSubredditPage() {
  const router = useRouter()
  const [subtitle, setSubtitle] = useState('')
  const [subdescription, setSubdescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      // TODO: Call API to create subreddit
      // await apiService.createSubreddit({ subtitle, subdescription })
      setSuccess(true)
      setTimeout(() => router.push('/home'), 1000)
    } catch {
      setError('Failed to create subreddit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Create Subreddit</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-indigo-400 transition-colors"
            placeholder="Subreddit title"
          />
        </div>
        <div>
          <label htmlFor="subdescription" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Subdescription
          </label>
          <textarea
            id="subdescription"
            value={subdescription}
            onChange={(e) => setSubdescription(e.target.value)}
            required
            rows={4}
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-indigo-400 transition-colors"
            placeholder="Describe your subreddit"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Subreddit created! Redirecting...</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            {isSubmitting ? 'Creating...' : 'Create Subreddit'}
          </button>
        </div>
      </form>
    </div>
  )
} 