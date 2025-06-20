'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Subreddit, UserJoinedSubs, useStore } from '@/store/useStore'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/services/api'
import { useSolanaWallets } from '@privy-io/react-auth'
import { chainHash, getCreatePostTransaction, submitTransactionToRollup } from '@/services/sovereign-api'
import { BasicSigner } from '@/services/signer'

export default function CreatePostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setPosts, posts, user } = useStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSub, setSelectedSub] = useState('')
  const [subsLoading, setSubsLoading] = useState(false)
  const [userSubs, setUserSubs] = useState<UserJoinedSubs[]>([])
  const {wallets} = useSolanaWallets()
  useEffect(() => {
    const fetchSubs = async () => {
      if (user && user.sov_id) {
        setSubsLoading(true)
        try {
          const res = await apiService.getUserSubs(user.sov_id)

          console.log("USER SUBS")
          console.log(res)

          setUserSubs([...res.user_subs])
        } catch {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load subreddits. Please try again.",
          })
        } finally {
          setSubsLoading(false)
        }
      }
    }
    fetchSubs()
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallets || wallets.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Connect your wallet first.",
      })
      return;
    }

    if (title.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subtitle must be at least 10 characters long.",
      })
      return;
    }

    if (content.length < 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subdescription must be at least 5 characters long.",
      })
      return;
    }


    try {
      // Here you would typically make an API call to create the post
      // For now, we'll just add it to the local state
      const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address) , chainHash)
      const subreddit_create_transaction = await getCreatePostTransaction(content , "" , selectedSub , title);
    
      await submitTransactionToRollup(subreddit_create_transaction, signer)
      
   
      toast({
        variant: "success",
        title: "Success!",
        description: "Your post has been created successfully.",
      })
      
      // Navigate to home after a short delay to show the toast
      setTimeout(() => {
        router.push('/home')
      }, 1000)
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      })
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
                  {sub.subname}
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