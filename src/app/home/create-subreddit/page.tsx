'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { BasicSigner } from '@/services/signer'
import { useSolanaWallets } from '@privy-io/react-auth'
import { chainHash, getCreateSubredditTransaction, submitTransactionToRollup } from '@/services/sovereign-api'

export default function CreateSubredditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [subtitle, setSubtitle] = useState('')
  const [subdescription, setSubdescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
const {wallets} = useSolanaWallets()
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

    if (subtitle.length < 4) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subtitle must be at least 4 characters long.",
      })
      return;
    }

    if (subdescription.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subdescription must be at least 10 characters long.",
      })
      return;
    }

    try {
      // TODO: Call API to create subreddit
      // await apiService.createSubreddit({ subtitle, subdescription })
      setIsSubmitting(true)
      const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address) , chainHash)
      const subreddit_create_transaction = await getCreateSubredditTransaction(subtitle , subdescription , await signer.getBs58Key());
    
    await submitTransactionToRollup(subreddit_create_transaction, signer)
    
      toast({
        variant: "success",
        title: "Success!",
        description: "Subreddit created successfully!",
      })
      
      // Navigate to home after a short delay to show the toast
      setTimeout(() => {
        router.push('/home')
      }, 1000)
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subreddit. Please try again.",
      })
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