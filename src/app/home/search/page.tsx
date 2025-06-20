'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { apiService } from '@/services/api'
import { Subreddit } from '@/store/useStore'



export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Subreddit[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.searchSubredditsByName({ query: searchQuery });
      // Assume response is an array of subreddits with id, name, members, description

      console.log("SEARCH RESULTS")
      console.log(res)

      setSearchResults([...res.subreddits]);
    } catch (err) {
      setError('Failed to search subreddits.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubredditClick = (subredditId: string) => {
    router.push(`/home/sub/${subredditId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <div>
      <FaSearch className="absolute mr-4 left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-2" />

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">

       
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subreddits..."
            className="w-full  p-4 pl-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-red-500"
          />
        </div>
      </form>

      </div>
      
      {loading && <div className="text-center text-gray-500">Searching...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {searchResults.map((subreddit) => (
          <div
            key={subreddit.sub_sov_id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleSubredditClick(subreddit.sub_sov_id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{subreddit.subname}</h2>
      
            </div>
            <p className="text-gray-600">{subreddit.sub_description.substring(0 , 20)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
} 