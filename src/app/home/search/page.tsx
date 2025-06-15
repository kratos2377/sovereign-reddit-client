'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface Subreddit {
  id: string
  name: string
  members: number
  description: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Subreddit[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to search subreddits
    // For now, we'll use dummy data
    const dummyResults: Subreddit[] = [
      {
        id: '1',
        name: 'r/programming',
        members: 4200000,
        description: 'Computer Programming',
      },
      {
        id: '2',
        name: 'r/technology',
        members: 12000000,
        description: 'Technology News and Discussion',
      },
    ]
    setSearchResults(dummyResults)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subreddits..."
            className="w-full p-4 pl-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-red-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </form>

      <div className="space-y-4">
        {searchResults.map((subreddit) => (
          <div
            key={subreddit.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{subreddit.name}</h2>
              <span className="text-sm text-gray-500">
                {subreddit.members.toLocaleString()} members
              </span>
            </div>
            <p className="text-gray-600">{subreddit.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 